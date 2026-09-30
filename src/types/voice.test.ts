import { describe, it, expect } from 'vitest'
import { isVoiceStatement } from './voice'

// The routing guard. If this returns false for a real voice statement, SDP
// blobs land in the game log, get persisted to localStorage and replayed into
// the deriver on every load. If it returns true for a game statement, moves
// vanish. Both are silent, so both get a test.
describe('isVoiceStatement', () => {
  const base = { gameId: 'ABC123', from: 'alice', to: 'bob', timestamp: 1 }

  it('accepts every voice type', () => {
    for (const type of ['voice_invite', 'voice_offer', 'voice_answer', 'voice_decline', 'voice_end']) {
      expect(isVoiceStatement({ ...base, type })).toBe(true)
    }
  })

  it('rejects game statements', () => {
    expect(isVoiceStatement({ type: 'create_game', gameId: 'ABC123', playerX: 'alice', timestamp: 1 })).toBe(false)
    expect(isVoiceStatement({ type: 'join_game', gameId: 'ABC123', playerO: 'bob', timestamp: 1 })).toBe(false)
    expect(isVoiceStatement({ type: 'make_move', gameId: 'ABC123', player: 'alice', cellIndex: 4, timestamp: 1 })).toBe(false)
  })

  it('rejects junk off the wire', () => {
    expect(isVoiceStatement(null)).toBe(false)
    expect(isVoiceStatement('voice_invite')).toBe(false)
    expect(isVoiceStatement({ type: 'voice_invite' })).toBe(false)           // no routing fields
    expect(isVoiceStatement({ ...base, type: 'voice_unknown' })).toBe(false) // future type
    expect(isVoiceStatement({ ...base, type: 'voice_invite', to: 42 })).toBe(false)
  })
})
