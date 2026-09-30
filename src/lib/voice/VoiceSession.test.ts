// Regressions for three silent failures found in review. All three share a
// shape: the session reaches a state the UI renders as harmless while
// something underneath is still live or stale.

import { describe, it, expect, vi, beforeEach } from 'vitest'

const stopped: string[] = []

/** A MediaStream stand-in whose tracks record being stopped. */
function fakeStream(id: string) {
  const track = {
    id,
    kind: 'audio',
    enabled: true,
    stop() { stopped.push(id) },
  }
  return {
    id,
    getTracks: () => [track],
    getAudioTracks: () => [track],
  } as unknown as MediaStream
}

let micCalls = 0
vi.mock('../webrtc/microphone', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../webrtc/microphone')>()
  return {
    ...actual, // keep the real stopStream, which is what we are testing
    requestMicrophone: async () => fakeStream(`mic-${++micCalls}`),
  }
})

vi.mock('../webrtc/iceConfig', () => ({ getIceServers: () => [] }))

class FakePC {
  connectionState = 'new'
  iceGatheringState = 'complete'
  localDescription = { sdp: 'v=0\r\nfake' }
  ontrack: unknown = null
  onconnectionstatechange: (() => void) | null = null
  closed = false
  addTrack() {}
  async createOffer() { return { type: 'offer', sdp: 'v=0\r\nfake' } }
  async createAnswer() { return { type: 'answer', sdp: 'v=0\r\nfake' } }
  async setLocalDescription() {}
  async setRemoteDescription() {}
  addEventListener() {}
  removeEventListener() {}
  close() { this.closed = true }
}
vi.stubGlobal('RTCPeerConnection', FakePC)

const { VoiceSession } = await import('./VoiceSession')

function makeSession(publish: (s: never) => Promise<void>, self = 'alice', peer = 'bob') {
  const states: string[] = []
  const session = new VoiceSession({
    gameId: 'ABC234',
    selfAddr: self,
    peerAddr: peer,
    publish: publish as never,
    onState: (s) => states.push(s),
    onRemoteStream: () => {},
    onLocalStream: () => {},
  })
  return { session, states }
}

describe('VoiceSession', () => {
  beforeEach(() => { stopped.length = 0; micCalls = 0 })

  it('releases the microphone when the invite cannot be published', async () => {
    // Before the fix this set state to 'failed' and returned, leaving the mic
    // open and the OS recording indicator lit while VoiceBar rendered "Talk".
    const { session, states } = makeSession(async () => { throw new Error('no transport') })
    await session.invite()

    expect(states).toContain('failed')
    expect(stopped).toHaveLength(1) // the device was actually released
  })

  it('releases the microphone when a malformed offer arrives', async () => {
    const { session } = makeSession(async () => {})
    await session.invite()
    expect(stopped).toHaveLength(0) // ringing, mic held legitimately

    await session.handleSignal({
      type: 'voice_offer', gameId: 'ABC234', from: 'bob', to: 'alice',
      timestamp: Date.now(), boxPub: 'aa'.repeat(32),
      sealed: { epk: 'nope', iv: 'nope', ct: '' },
    } as never)

    expect(stopped).toHaveLength(1)
  })

  it('releases the microphone on decline after a glare drop', async () => {
    // Glare: both sides invite at once. Lower SS58 wins, so this session is
    // deliberately the HIGHER one ('bob' > 'alice') — it abandons its own
    // invite and drops to 'ringing' while already holding a stream from it.
    // Declining then has to free that stream.
    const { session } = makeSession(async () => {}, 'bob', 'alice')
    await session.invite()
    await session.handleSignal({
      type: 'voice_invite', gameId: 'ABC234', from: 'alice', to: 'bob',
      timestamp: Date.now(), boxPub: 'bb'.repeat(32),
    } as never)
    await session.decline()

    expect(stopped).toHaveLength(1)
  })

  it('ignores a replayed invite', async () => {
    // The transport re-delivers every live statement on reconnect, and voice
    // bypasses the game log's dedupe. Without a guard the peer re-rings on
    // every page load until the statement expires.
    const { session, states } = makeSession(async () => {})
    const invite = {
      type: 'voice_invite', gameId: 'ABC234', from: 'bob', to: 'alice',
      timestamp: Date.now(), boxPub: 'bb'.repeat(32),
    } as never

    await session.handleSignal(invite)
    expect(states.filter((s) => s === 'ringing')).toHaveLength(1)

    await session.handleSignal(invite) // exact replay from the backfill
    expect(states.filter((s) => s === 'ringing')).toHaveLength(1)
  })

  it('ignores a stale invite', async () => {
    const { session, states } = makeSession(async () => {})
    await session.handleSignal({
      type: 'voice_invite', gameId: 'ABC234', from: 'bob', to: 'alice',
      timestamp: Date.now() - 10 * 60_000, // long expired
      boxPub: 'bb'.repeat(32),
    } as never)

    expect(states).not.toContain('ringing')
  })
})
