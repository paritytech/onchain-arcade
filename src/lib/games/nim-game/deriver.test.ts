import { describe, it, expect } from 'vitest'
import { deriveNim } from './deriver'
import type { GameStatement } from '@/types/game'

const ts = () => Date.now()
const gameId = 'NIMTST'

function makeStmts(...actions: GameStatement[]): GameStatement[] {
  return actions.map(a => ({ ...a, gameId }))
}

describe('deriveNim', () => {
  it('returns null for empty statements', () => {
    expect(deriveNim(gameId, [])).toBeNull()
  })

  it('returns waiting with default heaps after create', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'nim', timestamp: ts() },
    )
    const game = deriveNim(gameId, stmts)!
    expect(game.status).toBe('waiting')
    expect(game.heaps).toEqual([3, 4, 5])
    expect(game.gameType).toBe('nim')
  })

  it('uses custom nimConfig', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'nim', nimConfig: [1, 2, 3], timestamp: ts() },
    )
    const game = deriveNim(gameId, stmts)!
    expect(game.heaps).toEqual([1, 2, 3])
  })

  it('applies valid moves', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'nim', nimConfig: [3, 4, 5], timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', nimMove: { heap: 0, count: 2 }, timestamp: ts() },
    )
    const game = deriveNim(gameId, stmts)!
    expect(game.heaps).toEqual([1, 4, 5])
    expect(game.moveCount).toBe(1)
    expect(game.lastMove).toEqual({ heap: 0, count: 2 })
  })

  it('rejects move taking more than heap has', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'nim', nimConfig: [2, 3], timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', nimMove: { heap: 0, count: 5 }, timestamp: ts() }, // too many
    )
    const game = deriveNim(gameId, stmts)!
    expect(game.heaps).toEqual([2, 3])
    expect(game.moveCount).toBe(0)
  })

  it('rejects move on invalid heap index', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'nim', nimConfig: [2, 3], timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', nimMove: { heap: 5, count: 1 }, timestamp: ts() },
    )
    const game = deriveNim(gameId, stmts)!
    expect(game.moveCount).toBe(0)
  })

  it('misere rule: player taking last object loses', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'nim', nimConfig: [1, 1], timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'alice', nimMove: { heap: 0, count: 1 }, timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', nimMove: { heap: 1, count: 1 }, timestamp: ts() }, // bob takes last
    )
    const game = deriveNim(gameId, stmts)!
    expect(game.status).toBe('finished')
    expect(game.result).toBe('x_wins') // bob (O) took last → alice (X) wins
  })

  it('skips out-of-turn moves', () => {
    const stmts = makeStmts(
      { type: 'create_game', gameId, playerX: 'alice', gameType: 'nim', nimConfig: [3], timestamp: ts() },
      { type: 'join_game', gameId, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId, player: 'bob', nimMove: { heap: 0, count: 1 }, timestamp: ts() }, // wrong turn
    )
    const game = deriveNim(gameId, stmts)!
    expect(game.moveCount).toBe(0)
    expect(game.heaps).toEqual([3])
  })
})
