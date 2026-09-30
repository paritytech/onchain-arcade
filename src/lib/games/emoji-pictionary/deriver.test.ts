import { describe, it, expect } from 'vitest'
import { deriveEmojiPictionary } from './deriver'
import type { GameStatement } from '@/types/game'

const gid = 'EMJTST'
const ts = () => Date.now()

function makeStmts(...actions: GameStatement[]): GameStatement[] {
  return actions.map(a => ({ ...a, gameId: gid }))
}

describe('deriveEmojiPictionary', () => {
  it('returns null for empty statements', () => {
    expect(deriveEmojiPictionary(gid, [])).toBeNull()
  })

  it('returns waiting after create with 3 max players', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 3, timestamp: ts() },
    )
    const g = deriveEmojiPictionary(gid, stmts)!
    expect(g.status).toBe('waiting')
    expect(g.players).toHaveLength(1)
    expect(g.players[0].address).toBe('alice')
    expect(g.maxPlayers).toBe(3)
  })

  it('stays waiting until all players join', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 3, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
    )
    const g = deriveEmojiPictionary(gid, stmts)!
    expect(g.status).toBe('waiting')
    expect(g.players).toHaveLength(2)
  })

  it('starts playing when all players join', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 3, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'charlie', timestamp: ts() },
    )
    const g = deriveEmojiPictionary(gid, stmts)!
    expect(g.status).toBe('playing')
    expect(g.players).toHaveLength(3)
    expect(g.currentDescriber).toBe(0)
    expect(g.roundNumber).toBe(0)
  })

  it('prevents duplicate joins', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 3, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() }, // duplicate
    )
    const g = deriveEmojiPictionary(gid, stmts)!
    expect(g.players).toHaveLength(2)
    expect(g.status).toBe('waiting')
  })

  it('describer can send emoji clues', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 2, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', emojiClue: '🍕🔥', timestamp: ts() },
    )
    const g = deriveEmojiPictionary(gid, stmts)!
    expect(g.clues).toEqual(['🍕🔥'])
    expect(g.moveCount).toBe(1)
  })

  it('non-describer cannot send clues', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 2, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', emojiClue: '🍕', timestamp: ts() }, // bob is not describer
    )
    const g = deriveEmojiPictionary(gid, stmts)!
    expect(g.clues).toEqual([])
  })

  it('correct guess advances round and scores', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 2, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', emojiClue: '🍕', timestamp: ts() },
    )
    const g1 = deriveEmojiPictionary(gid, stmts)!
    const word = g1.currentWord

    // Bob guesses correctly
    const stmts2 = [...stmts, { type: 'make_move' as const, gameId: gid, player: 'bob', guess: word, timestamp: ts() }]
    const g2 = deriveEmojiPictionary(gid, stmts2)!
    expect(g2.roundNumber).toBe(1)
    expect(g2.currentDescriber).toBe(1) // bob's turn to describe
    expect(g2.players[1].score).toBe(3) // first correct = 3 pts
    expect(g2.players[0].score).toBe(1) // describer gets 1 pt
  })

  it('game finishes after all rounds', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 2, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
    )
    let g = deriveEmojiPictionary(gid, stmts)!
    const word0 = g.currentWord

    // Round 0: bob guesses
    const stmts2 = [...stmts, { type: 'make_move' as const, gameId: gid, player: 'bob', guess: word0, timestamp: ts() }]
    g = deriveEmojiPictionary(gid, stmts2)!
    const word1 = g.currentWord

    // Round 1: alice guesses
    const stmts3 = [...stmts2, { type: 'make_move' as const, gameId: gid, player: 'alice', guess: word1, timestamp: ts() }]
    g = deriveEmojiPictionary(gid, stmts3)!
    expect(g.status).toBe('finished')
  })

  it('describer can skip round', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 2, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', skipRound: true, timestamp: ts() },
    )
    const g = deriveEmojiPictionary(gid, stmts)!
    expect(g.roundNumber).toBe(1)
    expect(g.currentDescriber).toBe(1)
  })

  it('wrong guess does not advance round', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'emoji-pictionary', maxPlayers: 2, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', guess: 'wrong-answer', timestamp: ts() },
    )
    const g = deriveEmojiPictionary(gid, stmts)!
    expect(g.roundNumber).toBe(0)
    expect(g.guesses).toHaveLength(1)
    expect(g.guesses[0].correct).toBe(false)
  })
})
