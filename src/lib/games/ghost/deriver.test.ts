import { describe, it, expect } from 'vitest'
import { deriveGhost } from './deriver'
import { makeStmts, ts } from '../__test-utils__'

const gameId = 'GHOTST'

describe('deriveGhost', () => {
  it('returns null for empty statements', () => {
    expect(deriveGhost(gameId, [])).toBeNull()
  })

  it('returns waiting after create', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'ghost', timestamp: ts() },
    )
    const game = deriveGhost(gameId, stmts)!
    expect(game.status).toBe('waiting')
    expect(game.fragment).toBe('')
    expect(game.ghostLetters).toEqual({ X: 0, O: 0 })
    expect(game.gameType).toBe('ghost')
  })

  it('builds fragment correctly', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'ghost', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 's', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', ghostLetter: 't', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 'a', timestamp: ts() },
    )
    const game = deriveGhost(gameId, stmts)!
    expect(game.fragment).toBe('sta')
    expect(game.moveCount).toBe(3)
    expect(game.currentTurn).toBe('O')
  })

  it('penalizes current player when 4+ letter word is completed', () => {
    // 'face' is in the word list
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'ghost', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 'f', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', ghostLetter: 'a', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 'c', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', ghostLetter: 'e', timestamp: ts() },
    )
    const game = deriveGhost(gameId, stmts)!
    expect(game.completedWord).toBe(true)
    expect(game.ghostLetters.O).toBe(1) // bob (O) completed the word
    expect(game.fragment).toBe('') // fragment resets
    expect(game.status).toBe('playing')
  })

  it('challenge when fragment IS a prefix: challenger penalized', () => {
    // 'ab' is a prefix of 'able', 'about', 'above', etc.
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'ghost', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 'a', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', ghostLetter: 'b', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostChallenge: true, timestamp: ts() },
    )
    const game = deriveGhost(gameId, stmts)!
    expect(game.challengeResult).toBe('challenger_loses')
    expect(game.ghostLetters.X).toBe(1) // alice (X) challenged incorrectly
    expect(game.fragment).toBe('')
  })

  it('challenge when fragment NOT a prefix: previous player penalized', () => {
    // Build a fragment that is not a prefix of any word
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'ghost', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 'z', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', ghostLetter: 'x', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostChallenge: true, timestamp: ts() },
    )
    const game = deriveGhost(gameId, stmts)!
    expect(game.challengeResult).toBe('challenger_wins')
    expect(game.ghostLetters.O).toBe(1) // bob (O) was bluffing
    expect(game.fragment).toBe('')
  })

  it('fragment resets after word completion', () => {
    // Complete 'face', then start a new round
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'ghost', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 'f', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', ghostLetter: 'a', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 'c', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', ghostLetter: 'e', timestamp: ts() }, // completes 'face'
      // New round starts, turn resets to X
      { type: 'make_move', gameId, player: 'alice', ghostLetter: 't', timestamp: ts() },
    )
    const game = deriveGhost(gameId, stmts)!
    expect(game.fragment).toBe('t')
    expect(game.currentTurn).toBe('O')
  })

  it('5 ghost letters = game over', () => {
    // Simulate 5 word completions by O (bob)
    const moves: any[] = [
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'ghost', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
    ]
    // Each round: alice plays letters, bob completes a 4-letter word
    const words = ['face', 'call', 'back', 'dark', 'each']
    for (const word of words) {
      for (let i = 0; i < word.length; i++) {
        const player = i % 2 === 0 ? 'alice' : 'bob'
        moves.push({ type: 'make_move', gameId, player, ghostLetter: word[i], timestamp: ts() })
      }
    }

    const stmts = makeStmts(gameId, ...moves)
    const game = deriveGhost(gameId, stmts)!
    expect(game.status).toBe('finished')
    // All 5 words have even length (4), so O (bob, index 1,3) completes them
    expect(game.ghostLetters.O).toBe(5)
    expect(game.result).toBe('x_wins')
  })

  it('rejects out-of-turn moves', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'ghost', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', ghostLetter: 'a', timestamp: ts() }, // wrong turn
    )
    const game = deriveGhost(gameId, stmts)!
    expect(game.fragment).toBe('')
    expect(game.moveCount).toBe(0)
    expect(game.currentTurn).toBe('X')
  })
})
