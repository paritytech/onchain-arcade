/**
 * One 1-to-1 voice call, between the two players of a match.
 *
 * Deliberately not a mesh. Eleven of the twelve games are two-player, the
 * twelfth (Emoji Pictionary) is explicitly out of scope for now, and a
 * two-party call needs none of the peer scoring, fan-out budgeting or relay
 * machinery a swarm does. One RTCPeerConnection, one audio track each way.
 *
 * Signalling rides the Statement Store via the injected `publish` callback —
 * see ../../types/voice.ts for the three-statement handshake and why the
 * inviter ends up as the WebRTC *answerer*.
 *
 * ICE is non-trickle: each side gathers fully before publishing its SDP, so a
 * call costs three statements rather than one per candidate. Statement
 * allowance is the scarce resource; a few hundred ms of setup latency is not.
 */

import type { VoiceStatement } from '@/types/voice'
import { getIceServers } from '../webrtc/iceConfig'
import { requestMicrophone, stopStream, MicrophonePermissionError } from '../webrtc/microphone'
import { generateBoxKey, openSdp, sealSdp, isSealedSdp, type BoxKeyPair } from './sdpSeal'

export type VoiceState =
  /** No call. */
  | 'idle'
  /** We invited; waiting for the peer to accept. */
  | 'inviting'
  /** They invited; waiting for us to accept or decline. */
  | 'ringing'
  /** Handshake in flight — SDP exchanged, ICE connecting. */
  | 'connecting'
  /** Audio flowing. */
  | 'connected'
  /** The peer said no. */
  | 'declined'
  /** Could not connect, or dropped. `error` carries the reason. */
  | 'failed'

export interface VoiceSessionOptions {
  gameId: string
  selfAddr: string
  peerAddr: string
  publish: (stmt: VoiceStatement) => Promise<void>
  onState: (state: VoiceState, detail?: string) => void
  onRemoteStream: (stream: MediaStream | null) => void
  onLocalStream: (stream: MediaStream | null) => void
}

/**
 * How long to ring before giving up. Long enough for someone to notice a
 * prompt mid-game, short enough that a forgotten invite does not sit on the
 * peer's screen for the rest of the match.
 */
const RING_TIMEOUT_MS = 45_000

/** Bound on ICE gathering. Past this we publish what we have: a candidate that
 *  has not arrived in four seconds is usually a STUN server that will never
 *  answer, and the ones we do have are typically enough. */
const ICE_GATHER_TIMEOUT_MS = 4_000

/** Bound on reaching `connected` once SDP is exchanged. */
const CONNECT_TIMEOUT_MS = 30_000

/** Gather ICE fully (or until the bound), then resolve. */
function waitForIceGathering(pc: RTCPeerConnection, timeoutMs: number): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve()
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      pc.removeEventListener('icegatheringstatechange', onChange)
      resolve()
    }
    const onChange = () => {
      if (pc.iceGatheringState === 'complete') finish()
    }
    const timer = setTimeout(finish, timeoutMs)
    pc.addEventListener('icegatheringstatechange', onChange)
  })
}

export class VoiceSession {
  private pc: RTCPeerConnection | null = null
  private boxKey: BoxKeyPair | null = null
  /** The peer's box public key, from their invite or offer. */
  private peerBoxPub: string | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private _state: VoiceState = 'idle'
  private ringTimer: ReturnType<typeof setTimeout> | null = null
  private connectTimer: ReturnType<typeof setTimeout> | null = null
  private destroyed = false
  /** The invite we are currently responding to, so accept() knows the peer key. */
  private pendingInvite: VoiceStatement | null = null

  constructor(private readonly opts: VoiceSessionOptions) {}

  get state(): VoiceState {
    return this._state
  }

  private setState(next: VoiceState, detail?: string) {
    if (this.destroyed || this._state === next) return
    this._state = next
    this.opts.onState(next, detail)
  }

  /**
   * Whether this side wins a simultaneous-invite race.
   *
   * Two players hitting "Talk" at the same moment both publish an invite, and
   * without a rule both would then wait for the other to accept. Lower SS58
   * wins, which both sides can evaluate identically with no extra round trip.
   */
  private winsGlare(): boolean {
    return this.opts.selfAddr < this.opts.peerAddr
  }

  private base(type: VoiceStatement['type']) {
    return {
      type,
      gameId: this.opts.gameId,
      from: this.opts.selfAddr,
      to: this.opts.peerAddr,
      timestamp: Date.now(),
    }
  }

  /** Acquire the microphone. Done up front on BOTH sides — discovering a
   *  blocked mic after the peer has already accepted is a worse moment. */
  private async ensureMic(): Promise<boolean> {
    if (this.localStream) return true
    try {
      this.localStream = await requestMicrophone()
      this.opts.onLocalStream(this.localStream)
      return true
    } catch (err) {
      const detail =
        err instanceof MicrophonePermissionError
          ? err.message
          : 'Could not open the microphone.'
      this.setState('failed', detail)
      return false
    }
  }

  private buildPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection({ iceServers: getIceServers() })

    for (const track of this.localStream?.getAudioTracks() ?? []) {
      pc.addTrack(track, this.localStream!)
    }

    pc.ontrack = (ev) => {
      const [stream] = ev.streams
      this.remoteStream = stream ?? new MediaStream([ev.track])
      this.opts.onRemoteStream(this.remoteStream)
    }

    pc.onconnectionstatechange = () => {
      if (this.destroyed) return
      switch (pc.connectionState) {
        case 'connected':
          this.clearConnectTimer()
          this.setState('connected')
          break
        case 'failed':
          // Distinguished from a hang-up: nothing was agreed, so say so rather
          // than reporting a clean end the player did not ask for.
          this.setState('failed', 'Could not establish a direct audio connection.')
          break
        case 'disconnected':
          // May recover on its own — ICE restarts happen. Do not tear down.
          break
        case 'closed':
          break
      }
    }

    return pc
  }

  /** Side A: offer to talk. Costs one statement. */
  async invite(): Promise<void> {
    if (this._state !== 'idle' && this._state !== 'declined' && this._state !== 'failed') return
    if (!(await this.ensureMic())) return

    this.boxKey = generateBoxKey()
    this.setState('inviting')
    this.ringTimer = setTimeout(() => {
      this.setState('failed', 'No answer.')
      void this.end()
    }, RING_TIMEOUT_MS)

    try {
      await this.opts.publish({ ...this.base('voice_invite'), boxPub: this.boxKey.publicKeyHex } as VoiceStatement)
    } catch (err) {
      this.clearRingTimer()
      this.setState('failed', err instanceof Error ? err.message : 'Could not send the invite.')
    }
  }

  /** Side B: accept a ringing invite. Mints the offer and seals it to A. */
  async accept(): Promise<void> {
    if (this._state !== 'ringing' || !this.pendingInvite) return
    const invite = this.pendingInvite
    const peerPub = (invite as { boxPub?: string }).boxPub
    if (!peerPub) {
      this.setState('failed', 'The invite carried no key.')
      return
    }
    if (!(await this.ensureMic())) return

    this.peerBoxPub = peerPub
    this.boxKey = generateBoxKey()
    this.setState('connecting')
    this.armConnectTimer()

    try {
      this.pc = this.buildPeerConnection()
      const offer = await this.pc.createOffer()
      await this.pc.setLocalDescription(offer)
      await waitForIceGathering(this.pc, ICE_GATHER_TIMEOUT_MS)

      const sdp = this.pc.localDescription?.sdp
      if (!sdp) throw new Error('No local description after ICE gathering.')

      await this.opts.publish({
        ...this.base('voice_offer'),
        boxPub: this.boxKey.publicKeyHex,
        sealed: await sealSdp(this.peerBoxPub, sdp),
      } as VoiceStatement)
    } catch (err) {
      this.setState('failed', err instanceof Error ? err.message : 'Could not start the call.')
      await this.end()
    }
  }

  /** Side B: refuse. One statement so A stops ringing immediately. */
  async decline(): Promise<void> {
    if (this._state !== 'ringing') return
    this.pendingInvite = null
    this.setState('idle')
    try {
      await this.opts.publish(this.base('voice_decline') as VoiceStatement)
    } catch {
      /* best effort — A's ring timeout covers it */
    }
  }

  /** Hang up, or cancel an invite, from any state. */
  async end(announce = true): Promise<void> {
    const wasActive = this._state !== 'idle'
    this.teardownCall()
    if (this._state !== 'failed') this.setState('idle')
    if (announce && wasActive) {
      try {
        await this.opts.publish(this.base('voice_end') as VoiceStatement)
      } catch {
        /* best effort */
      }
    }
  }

  /** Feed an inbound signalling statement. Anything not addressed to us, or
   *  not for this game, is dropped by the caller before it gets here. */
  async handleSignal(stmt: VoiceStatement): Promise<void> {
    if (this.destroyed) return

    switch (stmt.type) {
      case 'voice_invite': {
        // Glare: we both invited. The lower address keeps its invite and
        // ignores the peer's; the higher address abandons its own and answers.
        if (this._state === 'inviting') {
          if (this.winsGlare()) return
          this.clearRingTimer()
        } else if (this._state !== 'idle' && this._state !== 'declined' && this._state !== 'failed') {
          return
        }
        this.pendingInvite = stmt
        this.setState('ringing')
        return
      }

      case 'voice_offer': {
        // We invited, they accepted: we are the answerer.
        if (this._state !== 'inviting' && this._state !== 'ringing') return
        this.clearRingTimer()
        if (!this.boxKey) return
        if (!isSealedSdp(stmt.sealed)) {
          this.setState('failed', 'The call offer was malformed.')
          return
        }
        this.peerBoxPub = stmt.boxPub
        this.setState('connecting')
        this.armConnectTimer()
        try {
          const offerSdp = await openSdp(this.boxKey, stmt.sealed)
          this.pc = this.buildPeerConnection()
          await this.pc.setRemoteDescription({ type: 'offer', sdp: offerSdp })
          const answer = await this.pc.createAnswer()
          await this.pc.setLocalDescription(answer)
          await waitForIceGathering(this.pc, ICE_GATHER_TIMEOUT_MS)

          const sdp = this.pc.localDescription?.sdp
          if (!sdp) throw new Error('No local description after ICE gathering.')

          await this.opts.publish({
            ...this.base('voice_answer'),
            sealed: await sealSdp(this.peerBoxPub, sdp),
          } as VoiceStatement)
        } catch (err) {
          // A sealed SDP that will not open is dropped, never retried in the
          // clear — a downgrade path would defeat the sealing entirely.
          this.setState('failed', err instanceof Error ? err.message : 'Could not answer the call.')
          await this.end()
        }
        return
      }

      case 'voice_answer': {
        if (this._state !== 'connecting' || !this.pc || !this.boxKey) return
        if (!isSealedSdp(stmt.sealed)) {
          this.setState('failed', 'The call answer was malformed.')
          return
        }
        try {
          const answerSdp = await openSdp(this.boxKey, stmt.sealed)
          await this.pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })
        } catch (err) {
          this.setState('failed', err instanceof Error ? err.message : 'Could not complete the call.')
          await this.end()
        }
        return
      }

      case 'voice_decline': {
        if (this._state !== 'inviting') return
        this.clearRingTimer()
        this.teardownCall()
        this.setState('declined')
        return
      }

      case 'voice_end': {
        if (this._state === 'idle') return
        this.teardownCall()
        this.setState('idle')
        return
      }
    }
  }

  /** Mute by disabling the track rather than stopping it: stopping releases the
   *  device, which drops the OS mic indicator and needs a fresh permission
   *  round-trip to undo. */
  setMuted(muted: boolean): void {
    for (const track of this.localStream?.getAudioTracks() ?? []) {
      track.enabled = !muted
    }
  }

  get muted(): boolean {
    const track = this.localStream?.getAudioTracks()[0]
    return track ? !track.enabled : false
  }

  destroy(): void {
    this.destroyed = true
    this.teardownCall()
  }

  private armConnectTimer() {
    this.clearConnectTimer()
    this.connectTimer = setTimeout(() => {
      if (this._state === 'connecting') {
        this.setState('failed', 'The call did not connect.')
        void this.end()
      }
    }, CONNECT_TIMEOUT_MS)
  }

  private clearConnectTimer() {
    if (this.connectTimer) {
      clearTimeout(this.connectTimer)
      this.connectTimer = null
    }
  }

  private clearRingTimer() {
    if (this.ringTimer) {
      clearTimeout(this.ringTimer)
      this.ringTimer = null
    }
  }

  private teardownCall() {
    this.clearRingTimer()
    this.clearConnectTimer()
    if (this.pc) {
      this.pc.ontrack = null
      this.pc.onconnectionstatechange = null
      try {
        this.pc.close()
      } catch {
        /* already closed */
      }
      this.pc = null
    }
    stopStream(this.localStream)
    this.localStream = null
    this.remoteStream = null
    this.boxKey = null
    this.peerBoxPub = null
    this.pendingInvite = null
    this.opts.onLocalStream(null)
    this.opts.onRemoteStream(null)
  }
}
