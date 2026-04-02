import { describe, it, expect } from 'vitest'
import { deriveTicTacToe } from './deriver'
import type { GameStatement } from '@/types/game'

const ts = () => Date.now()

function makeStmts(gameId: string, ...actions: GameStatement[]): GameStatement[] {
  return actions.map(a => ({ ...a, gameId }))
}

describe('deriveTicTacToe', () => {
  const gameId = 'TEST01'

  it('returns null for empty statements', () => {
    expect(deriveTicTacToe(gameId, [])).toBeNull()
  })

  it('returns waiting status after create', () => {
    const stmts = makeStmts(gameId, { type: 'create_game', gameId, playerX: 'alice', timestamp: ts() })
    const game = deriveTicTacToe(gameId, stmts)!
    expect(game.status).toBe('waiting')
    expect(game.playerX).toBe('alice')
    expect(game.playerO).toBeNull()
    expect(game.gameType).toBe('tic-tac-toe')
  })

  it('returns playing status after join', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
    )
    const game = deriveTicTacToe(gameId, stmts)!
    expect(game.status).toBe('playing')
    expect(game.playerO).toBe('bob')
    expect(game.currentTurn).toBe('X')
  })

  it('detects X wins on top row', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 3, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 1, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 4, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 2, timestamp: ts() },
    )
    const game = deriveTicTacToe(gameId, stmts)!
    expect(game.status).toBe('finished')
    expect(game.result).toBe('x_wins')
    expect(game.winningLine).toEqual([0, 1, 2])
  })

  it('detects draw', () => {
    // X O X
    // X X O
    // O X O
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 1, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 2, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 5, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 3, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 6, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 4, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 8, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 7, timestamp: ts() },
    )
    const game = deriveTicTacToe(gameId, stmts)!
    expect(game.status).toBe('finished')
    expect(game.result).toBe('draw')
  })

  it('skips out-of-turn moves', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 0, timestamp: ts() }, // out of turn
    )
    const game = deriveTicTacToe(gameId, stmts)!
    expect(game.moveCount).toBe(0)
    expect(game.board[0]).toBeNull()
  })

  it('skips moves to occupied cells', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 0, timestamp: ts() }, // occupied
    )
    const game = deriveTicTacToe(gameId, stmts)!
    expect(game.moveCount).toBe(1)
    expect(game.board[0]).toBe('X')
  })

  it('skips moves after game is finished', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 0, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 3, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 1, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', cellIndex: 4, timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', cellIndex: 2, timestamp: ts() }, // X wins
      { type: 'make_move', gameId, player: 'bob', cellIndex: 5, timestamp: ts() }, // should be skipped
    )
    const game = deriveTicTacToe(gameId, stmts)!
    expect(game.moveCount).toBe(5)
    expect(game.board[5]).toBeNull()
  })

  it('uses gridSize from create statement', () => {
    const stmts = makeStmts(gameId,
      { type: 'create_game', gameId, playerX: 'alice', gridSize: 5, timestamp: ts() },
    )
    const game = deriveTicTacToe(gameId, stmts)!
    expect(game.gridSize).toBe(5)
    expect(game.board.length).toBe(25)
  })
})
