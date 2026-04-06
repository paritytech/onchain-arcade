import { describe, it, expect } from 'vitest'
import { deriveEntropy, generatePieceQueue, scoreBoard } from './deriver'
import { makeStmts, ts } from '../__test-utils__'

const gid = 'ENTTST'

describe('deriveEntropy', () => {
  it('returns null for empty statements', () => {
    expect(deriveEntropy(gid, [])).toBeNull()
  })

  it('returns waiting after create', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'entropy', entropyConfig: { seed: 42 }, timestamp: ts() },
    )
    const g = deriveEntropy(gid, stmts)!
    expect(g.status).toBe('waiting')
    expect(g.board.every(c => c === null)).toBe(true)
    expect(g.round).toBe(1)
    expect(g.phase).toBe('chaos')
    expect(g.piecesPlaced).toBe(0)
    expect(g.chaosPlayer).toBe('X')
    expect(g.gameType).toBe('entropy')
  })

  it('chaos places piece on empty cell', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'entropy', entropyConfig: { seed: 42 }, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', entropyPlace: 0, timestamp: ts() },
    )
    const g = deriveEntropy(gid, stmts)!
    expect(g.board[0]).not.toBeNull()
    expect(g.piecesPlaced).toBe(1)
    expect(g.phase).toBe('order')
    expect(g.currentTurn).toBe('O') // Order's turn
  })

  it('order slides piece orthogonally', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'entropy', entropyConfig: { seed: 42 }, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', entropyPlace: 0, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', entropySlide: { from: 0, to: 1 }, timestamp: ts() },
    )
    const g = deriveEntropy(gid, stmts)!
    expect(g.board[0]).toBeNull()
    expect(g.board[1]).not.toBeNull()
    expect(g.phase).toBe('chaos')
    expect(g.currentTurn).toBe('X') // back to Chaos
  })

  it('order cannot slide through other pieces', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'entropy', entropyConfig: { seed: 42 }, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // Place two pieces adjacent in row 0
      { type: 'make_move', gameId: gid, player: 'alice', entropyPlace: 0, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', entropyPass: true, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', entropyPlace: 1, timestamp: ts() },
      // Try to slide piece at 0 to 2 — blocked by piece at 1
      { type: 'make_move', gameId: gid, player: 'bob', entropySlide: { from: 0, to: 2 }, timestamp: ts() },
    )
    const g = deriveEntropy(gid, stmts)!
    // Slide should be rejected — piece still at 0
    expect(g.board[0]).not.toBeNull()
    expect(g.board[2]).toBeNull()
  })

  it('order can pass', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'entropy', entropyConfig: { seed: 42 }, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', entropyPlace: 0, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', entropyPass: true, timestamp: ts() },
    )
    const g = deriveEntropy(gid, stmts)!
    expect(g.phase).toBe('chaos')
    expect(g.currentTurn).toBe('X')
    expect(g.piecesPlaced).toBe(1)
  })

  it('scoring: run of 3 same color in a row = 3 points', () => {
    const board: (import('@/types/derived-game').EntropyColor | null)[] = Array(49).fill(null)
    // Place R R R in first row
    board[0] = 'R'
    board[1] = 'R'
    board[2] = 'R'
    const score = scoreBoard(board)
    // Run of 3: 3*(3-1)/2 = 3
    expect(score).toBe(3)
  })

  it('scoring: run of 2 = 1 point, run of 4 = 6 points', () => {
    const board: (import('@/types/derived-game').EntropyColor | null)[] = Array(49).fill(null)
    // Row 0: R R (run of 2 = 1)
    board[0] = 'R'
    board[1] = 'R'
    // Row 1: B B B B (run of 4 = 6)
    board[7] = 'B'
    board[8] = 'B'
    board[9] = 'B'
    board[10] = 'B'
    const score = scoreBoard(board)
    expect(score).toBe(1 + 6)
  })

  it('round 1 ends after 35 pieces placed and final order move', () => {
    // Build statements for 35 chaos placements + 35 order passes
    const actions: import('@/types/game').GameStatement[] = [
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'entropy', entropyConfig: { seed: 42 }, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
    ]

    let cellIdx = 0
    for (let i = 0; i < 35; i++) {
      actions.push({ type: 'make_move', gameId: gid, player: 'alice', entropyPlace: cellIdx, timestamp: ts() })
      cellIdx++
      if (i < 34) {
        // Order passes (not the last one — the last chaos place transitions to final order turn)
        actions.push({ type: 'make_move', gameId: gid, player: 'bob', entropyPass: true, timestamp: ts() })
      }
    }
    // Final order pass after all pieces placed
    actions.push({ type: 'make_move', gameId: gid, player: 'bob', entropyPass: true, timestamp: ts() })

    const stmts = makeStmts(gid, ...actions)
    const g = deriveEntropy(gid, stmts)!
    // Should now be in round 2
    expect(g.round).toBe(2)
    expect(g.piecesPlaced).toBe(0)
    expect(g.board.every(c => c === null)).toBe(true)
  })

  it('roles swap for round 2', () => {
    const actions: import('@/types/game').GameStatement[] = [
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'entropy', entropyConfig: { seed: 42 }, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
    ]

    let cellIdx = 0
    for (let i = 0; i < 35; i++) {
      actions.push({ type: 'make_move', gameId: gid, player: 'alice', entropyPlace: cellIdx, timestamp: ts() })
      cellIdx++
      if (i < 34) {
        actions.push({ type: 'make_move', gameId: gid, player: 'bob', entropyPass: true, timestamp: ts() })
      }
    }
    actions.push({ type: 'make_move', gameId: gid, player: 'bob', entropyPass: true, timestamp: ts() })

    const stmts = makeStmts(gid, ...actions)
    const g = deriveEntropy(gid, stmts)!
    // Round 2: X=Order, O=Chaos
    expect(g.chaosPlayer).toBe('O')
    expect(g.orderPlayer).toBe('X')
    expect(g.currentTurn).toBe('O') // Chaos goes first
  })

  it('game ends after both rounds', () => {
    const actions: import('@/types/game').GameStatement[] = [
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'entropy', entropyConfig: { seed: 42 }, timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
    ]

    // Round 1: alice=Chaos(X), bob=Order(O)
    let cellIdx = 0
    for (let i = 0; i < 35; i++) {
      actions.push({ type: 'make_move', gameId: gid, player: 'alice', entropyPlace: cellIdx, timestamp: ts() })
      cellIdx++
      if (i < 34) {
        actions.push({ type: 'make_move', gameId: gid, player: 'bob', entropyPass: true, timestamp: ts() })
      }
    }
    actions.push({ type: 'make_move', gameId: gid, player: 'bob', entropyPass: true, timestamp: ts() })

    // Round 2: bob=Chaos(O), alice=Order(X)
    cellIdx = 0
    for (let i = 0; i < 35; i++) {
      actions.push({ type: 'make_move', gameId: gid, player: 'bob', entropyPlace: cellIdx, timestamp: ts() })
      cellIdx++
      if (i < 34) {
        actions.push({ type: 'make_move', gameId: gid, player: 'alice', entropyPass: true, timestamp: ts() })
      }
    }
    actions.push({ type: 'make_move', gameId: gid, player: 'alice', entropyPass: true, timestamp: ts() })

    const stmts = makeStmts(gid, ...actions)
    const g = deriveEntropy(gid, stmts)!
    expect(g.status).toBe('finished')
    expect(g.result).not.toBeNull()
  })

  it('deterministic seed produces same piece order', () => {
    const q1 = generatePieceQueue(12345)
    const q2 = generatePieceQueue(12345)
    expect(q1).toEqual(q2)
    expect(q1.length).toBe(35)
    // Different seed → different order
    const q3 = generatePieceQueue(99999)
    expect(q1).not.toEqual(q3)
  })
})
