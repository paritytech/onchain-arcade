import { describe, it, expect } from 'vitest'
import { deriveBlokusDuo, rotatePiece, getCells, isValidPlacement } from './deriver'
import { makeStmts, ts } from '../__test-utils__'

const gid = 'BLKTST'

describe('deriveBlokusDuo', () => {
  it('returns null for empty statements', () => {
    expect(deriveBlokusDuo(gid, [])).toBeNull()
  })

  it('returns waiting after create', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.status).toBe('waiting')
    expect(g.board.length).toBe(196)
    expect(g.board.every(c => c === null)).toBe(true)
    expect(g.remainingPieces.X.length).toBe(21)
    expect(g.remainingPieces.O.length).toBe(21)
    expect(g.scores).toEqual({ X: 0, O: 0 })
    expect(g.gameType).toBe('blokus-duo')
  })

  it('first piece must cover starting cell 60 for X', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // Place monomino at cell 0 — does NOT cover cell 60
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 0, position: 0, rotation: 0, flip: false }, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.moveCount).toBe(0)
    expect(g.board[0]).toBeNull()
  })

  it('accepts valid first move covering starting cell', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // Place monomino at cell 60 — covers starting cell
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 0, position: 60, rotation: 0, flip: false }, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.moveCount).toBe(1)
    expect(g.board[60]).toBe('X')
    expect(g.scores.X).toBe(1)
    expect(g.remainingPieces.X).not.toContain(0)
    expect(g.currentTurn).toBe('O')
  })

  it('rejects edge-adjacent placement to own color', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // X places monomino at 60
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 0, position: 60, rotation: 0, flip: false }, timestamp: ts() },
      // O places monomino at 135
      { type: 'make_move', gameId: gid, player: 'bob', blokusMove: { pieceId: 0, position: 135, rotation: 0, flip: false }, timestamp: ts() },
      // X tries to place domino at 61 (edge-adjacent to 60) — should fail
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 1, position: 61, rotation: 0, flip: false }, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.moveCount).toBe(2) // only first two moves count
    expect(g.board[61]).toBeNull()
  })

  it('accepts corner-adjacent placement', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // X places monomino at 60 (row 4, col 4)
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 0, position: 60, rotation: 0, flip: false }, timestamp: ts() },
      // O places monomino at 135 (row 9, col 9)
      { type: 'make_move', gameId: gid, player: 'bob', blokusMove: { pieceId: 0, position: 135, rotation: 0, flip: false }, timestamp: ts() },
      // X places domino at 47 (row 3, col 5) — diagonally touches 60 at corner (row3,col5 is diagonal to row4,col4)
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 1, position: 47, rotation: 0, flip: false }, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.moveCount).toBe(3)
    expect(g.board[47]).toBe('X') // row 3, col 5
    expect(g.board[48]).toBe('X') // row 3, col 6
    expect(g.scores.X).toBe(3) // 1 monomino + 2 domino
  })

  it('rejects already-used piece', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // X places monomino at 60
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 0, position: 60, rotation: 0, flip: false }, timestamp: ts() },
      // O places monomino at 135
      { type: 'make_move', gameId: gid, player: 'bob', blokusMove: { pieceId: 0, position: 135, rotation: 0, flip: false }, timestamp: ts() },
      // X tries to place monomino again at 47 (diagonal to 60) — should fail, piece already used
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 0, position: 47, rotation: 0, flip: false }, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.moveCount).toBe(2)
    expect(g.board[47]).toBeNull()
  })

  it('counts scores correctly', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // X places L3 (id=3, shape [[0,0],[0,1],[1,0]]) at position 60
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 3, position: 60, rotation: 0, flip: false }, timestamp: ts() },
      // O places monomino at 135
      { type: 'make_move', gameId: gid, player: 'bob', blokusMove: { pieceId: 0, position: 135, rotation: 0, flip: false }, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.scores.X).toBe(3) // L3 has 3 cells
    expect(g.scores.O).toBe(1) // monomino has 1 cell
  })

  it('two passes end the game', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // X places monomino at 60
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 0, position: 60, rotation: 0, flip: false }, timestamp: ts() },
      // O places monomino at 135
      { type: 'make_move', gameId: gid, player: 'bob', blokusMove: { pieceId: 0, position: 135, rotation: 0, flip: false }, timestamp: ts() },
      // X passes
      { type: 'make_move', gameId: gid, player: 'alice', blokusPass: true, timestamp: ts() },
      // O passes
      { type: 'make_move', gameId: gid, player: 'bob', blokusPass: true, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.status).toBe('finished')
    expect(g.result).toBe('draw') // both have 1 cell
    expect(g.consecutivePasses).toBe(2)
  })

  it('two passes with different scores give correct winner', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // X places L3 at 60 (3 cells)
      { type: 'make_move', gameId: gid, player: 'alice', blokusMove: { pieceId: 3, position: 60, rotation: 0, flip: false }, timestamp: ts() },
      // O places monomino at 135 (1 cell)
      { type: 'make_move', gameId: gid, player: 'bob', blokusMove: { pieceId: 0, position: 135, rotation: 0, flip: false }, timestamp: ts() },
      // X passes
      { type: 'make_move', gameId: gid, player: 'alice', blokusPass: true, timestamp: ts() },
      // O passes
      { type: 'make_move', gameId: gid, player: 'bob', blokusPass: true, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.status).toBe('finished')
    expect(g.result).toBe('x_wins')
  })

  it('rejects out-of-turn moves', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'blokus-duo', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // O tries to move first — should be X's turn
      { type: 'make_move', gameId: gid, player: 'bob', blokusMove: { pieceId: 0, position: 135, rotation: 0, flip: false }, timestamp: ts() },
    )
    const g = deriveBlokusDuo(gid, stmts)!
    expect(g.moveCount).toBe(0)
    expect(g.board[135]).toBeNull()
  })
})

describe('rotatePiece', () => {
  it('rotates domino 90 degrees', () => {
    const domino: [number, number][] = [[0, 0], [0, 1]]
    const rotated = rotatePiece(domino, 1, false)
    // After 90 degree rotation, horizontal domino becomes vertical
    expect(rotated).toEqual([[0, 0], [1, 0]])
  })

  it('flips a piece', () => {
    const lShape: [number, number][] = [[0, 0], [0, 1], [1, 0]]
    const flipped = rotatePiece(lShape, 0, true)
    // [[0,0],[0,-1],[1,0]] -> normalized: [[0,1],[0,0],[1,1]]
    expect(flipped).toEqual([[0, 1], [0, 0], [1, 1]])
  })
})

describe('getCells', () => {
  it('returns flat indices for piece at position', () => {
    const shape: [number, number][] = [[0, 0], [0, 1]]
    const cells = getCells(0, shape)
    expect(cells).toEqual([0, 1])
  })

  it('returns null if piece goes off board', () => {
    const shape: [number, number][] = [[0, 0], [0, 1]]
    // Position at column 13 (last column), domino would extend off board
    const cells = getCells(13, shape)
    expect(cells).toBeNull()
  })
})

describe('isValidPlacement', () => {
  it('rejects placement on occupied cell', () => {
    const board: (('X' | 'O' | null)[]) = Array(196).fill(null)
    board[60] = 'X'
    expect(isValidPlacement(board, [60], 'O', true, 135)).toBe(false)
  })
})
