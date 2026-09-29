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

/**
 * How old an invite may be and still ring.
 *
 * The Statement Store subscription replays every live matching statement on
 * connect, and re-runs that backfill on each reconnect. Voice statements are
 * routed around the game log — which is also what routes them around its
 * dedupe — so a `voice_invite` from a call that ended without a clean hang-up
 * re-rings the peer on every page load until the statement expires (5 minutes
 * on the host transport, 30 seconds on the raw RPC one).
 *
 * Generous relative to that window because the two clocks are not
 * synchronised: this only has to reject a replay, not police latency.
 */
const INVITE_MAX_AGE_MS = 120_000

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
  /** Statements already acted on, so a subscription backfill cannot re-fire
   *  them. Bounded by evicting oldest-first — a call is a handful of
   *  statements, so this never grows meaningfully. */
  private seen = new Set<string>()

  constructor(private readonly opts: VoiceSessionOptions) {}

  get state(): VoiceState {
    return this._state
  }

  /**
   * Terminal failure: release the device FIRST, then report.
   *
   * Every failing path used to call setState('failed', …) directly and return,
   * which left the microphone open, the OS recording indicator lit and the
   * RTCPeerConnection alive with its handlers attached — while VoiceBar, seeing
   * a non-call state, rendered "Talk" again. A user who saw a call fail had no
   * way to tell they were still being captured.
   *
   * The orphaned connection was the second half of it: its
   * onconnectionstatechange stayed wired to setState, so a failed call could
   * later overwrite the state of a DIFFERENT call that was carrying audio.
   * teardownCall() nulls the handlers before closing, so routing every failure
   * through here fixes both.
   */
  private fail(detail: string) {
    this.teardownCall()
    this.setState('failed', detail)
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
          this.fail('Could not establish a direct audio connection.')
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
      this.fail(err instanceof Error ? err.message : 'Could not send the invite.')
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
      // Held locally: ICE gathering takes up to ICE_GATHER_TIMEOUT_MS, and the
      // peer can cancel in that window — handleSignal('voice_end') tears down
      // and nulls this.pc, so reading this.pc.localDescription afterwards threw
      // a raw TypeError that surfaced to the player as an error toast reading
      // "Cannot read properties of null".
      const pc = this.buildPeerConnection()
      this.pc = pc
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      await waitForIceGathering(pc, ICE_GATHER_TIMEOUT_MS)
      if (this.pc !== pc || this.destroyed) return // cancelled while gathering

      const sdp = pc.localDescription?.sdp
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
    // Normally nothing was acquired while ringing — but in the glare case this
    // side dropped to 'ringing' from its OWN invite and is already holding a
    // microphone. Declining has to release it.
    this.teardownCall()
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

    // Drop replays. The transport has no dedupe on this path (game statements
    // get theirs from the log these deliberately bypass), and it re-delivers
    // the live set on every reconnect.
    const key = `${stmt.type}:${stmt.from}:${stmt.timestamp}`
    if (this.seen.has(key)) return
    this.seen.add(key)
    if (this.seen.size > 64) this.seen.delete(this.seen.values().next().value as string)

    // An invite is the only signal that can start a call from idle, so it is
    // the only one a stale replay can turn into a phantom ring.
    if (stmt.type === 'voice_invite' && Date.now() - stmt.timestamp > INVITE_MAX_AGE_MS) {
      return
    }

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
          this.fail('The call offer was malformed.')
          return
        }
        this.peerBoxPub = stmt.boxPub
        this.setState('connecting')
        this.armConnectTimer()
        try {
          const offerSdp = await openSdp(this.boxKey, stmt.sealed)
          // Same cancellation window as accept() — see the note there.
          const pc = this.buildPeerConnection()
          this.pc = pc
          await pc.setRemoteDescription({ type: 'offer', sdp: offerSdp })
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          await waitForIceGathering(pc, ICE_GATHER_TIMEOUT_MS)
          if (this.pc !== pc || this.destroyed) return // cancelled while gathering

          const sdp = pc.localDescription?.sdp
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
          this.fail('The call answer was malformed.')
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
