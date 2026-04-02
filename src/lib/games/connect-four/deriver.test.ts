import { describe, it, expect } from 'vitest'
import { deriveConnectFour } from './deriver'
import type { GameStatement } from '@/types/game'

const ts = () => Date.now()
const gameId = 'C4TEST'

function makeStmts(...actions: GameStatement[]): GameStatement[] {
  return actions.map(a => ({ ...a, gameId }))
}

describe('deriveConnectFour', () => {
  it('returns null for empty statements', () => {
    expect(deriveConnectFour(gameId, [])).toBeNull()
  })

  it('returns waiting after create', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'connect-four', timestamp: ts() },
    )
    const game = deriveConnectFour(gameId, stmts)!
    expect(game.status).toBe('waiting')
    expect(game.board.length).toBe(42)
    expect(game.gameType).toBe('connect-four')
  })

  it('applies gravity — disc falls to bottom', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'connect-four', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 3, timestamp: ts() },
    )
    const game = deriveConnectFour(gameId, stmts)!
    // Column 3, bottom row (row 5) → index 5*7+3 = 38
    expect(game.board[38]).toBe('X')
    expect(game.board[3]).toBeNull() // top of column still empty
  })

  it('stacks discs in same column', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'connect-four', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', column: 0, timestamp: ts() },
    )
    const game = deriveConnectFour(gameId, stmts)!
    expect(game.board[35]).toBe('X') // row 5, col 0
    expect(game.board[28]).toBe('O') // row 4, col 0
  })

  it('rejects moves to full columns', () => {
    const moves: GameStatement[] = [
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'connect-four', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
    ]
    // Fill column 0 with 6 discs (alternating players)
    for (let i = 0; i < 6; i++) {
      moves.push({ type: 'make_move', gameId, player: i % 2 === 0 ? 'alice' : 'bob', column: 0, timestamp: ts() })
    }
    // 7th move to column 0 should be rejected
    moves.push({ type: 'make_move', gameId, player: 'alice', column: 0, timestamp: ts() })
    const game = deriveConnectFour(gameId, makeStmts(...moves))!
    expect(game.moveCount).toBe(6) // only 6 valid moves
  })

  it('detects horizontal win', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'connect-four', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', column: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 1, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', column: 1, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 2, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', column: 2, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 3, timestamp: ts() }, // 4 in a row
    )
    const game = deriveConnectFour(gameId, stmts)!
    expect(game.status).toBe('finished')
    expect(game.result).toBe('x_wins')
    expect(game.winningLine).toEqual([35, 36, 37, 38])
  })

  it('detects vertical win', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'connect-four', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', column: 1, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', column: 1, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', column: 1, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', column: 0, timestamp: ts() }, // 4 vertical
    )
    const game = deriveConnectFour(gameId, stmts)!
    expect(game.status).toBe('finished')
    expect(game.result).toBe('x_wins')
  })
})
