import { describe, it, expect } from 'vitest'
import { deriveReversi } from './deriver'
import { makeStmts, ts } from '../__test-utils__'

const gid = 'REVTST'

describe('deriveReversi', () => {
  it('returns null for empty statements', () => {
    expect(deriveReversi(gid, [])).toBeNull()
  })

  it('returns waiting with initial 4 discs after create', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'reversi', timestamp: ts() },
    )
    const g = deriveReversi(gid, stmts)!
    expect(g.status).toBe('waiting')
    expect(g.board[27]).toBe('O')
    expect(g.board[28]).toBe('X')
    expect(g.board[35]).toBe('X')
    expect(g.board[36]).toBe('O')
    expect(g.scores).toEqual({ X: 2, O: 2 })
    expect(g.gameType).toBe('reversi')
  })

  it('has valid moves for X at start', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'reversi', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
    )
    const g = deriveReversi(gid, stmts)!
    // Standard opening: X can play at 19(2,3), 26(3,2), 37(4,5), 44(5,4)
    expect(g.validMoves.length).toBe(4)
    expect(g.validMoves).toContain(19) // (2,3)
    expect(g.validMoves).toContain(26) // (3,2)
    expect(g.validMoves).toContain(37) // (4,5)
    expect(g.validMoves).toContain(44) // (5,4)
  })

  it('flips discs on valid move', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'reversi', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', cellIndex: 19, timestamp: ts() }, // (2,3) — flips O at (3,3)=27
    )
    const g = deriveReversi(gid, stmts)!
    expect(g.board[19]).toBe('X')
    expect(g.board[27]).toBe('X') // was O, now flipped
    expect(g.scores.X).toBe(4) // 2 original + 1 placed + 1 flipped
    expect(g.scores.O).toBe(1)
    expect(g.currentTurn).toBe('O')
  })

  it('rejects move with no flips', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'reversi', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', cellIndex: 0, timestamp: ts() }, // corner, no flips
    )
    const g = deriveReversi(gid, stmts)!
    expect(g.moveCount).toBe(0)
    expect(g.board[0]).toBeNull()
  })

  it('rejects move on occupied cell', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'reversi', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', cellIndex: 27, timestamp: ts() }, // already has O
    )
    const g = deriveReversi(gid, stmts)!
    expect(g.moveCount).toBe(0)
  })

  it('skips out-of-turn moves', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'reversi', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', cellIndex: 19, timestamp: ts() }, // wrong turn
    )
    const g = deriveReversi(gid, stmts)!
    expect(g.moveCount).toBe(0)
  })

  it('computes valid moves after each turn', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'reversi', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', cellIndex: 19, timestamp: ts() },
    )
    const g = deriveReversi(gid, stmts)!
    expect(g.validMoves.length).toBeGreaterThan(0)
    expect(g.currentTurn).toBe('O')
  })
})
