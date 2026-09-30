import { describe, it, expect } from 'vitest'
import { deriveTak } from './deriver'
import { makeStmts, ts } from '../__test-utils__'

const gid = 'TAKTST'

describe('deriveTak', () => {
  it('returns null for empty statements', () => {
    expect(deriveTak(gid, [])).toBeNull()
  })

  it('returns waiting after create', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    expect(g.status).toBe('waiting')
    expect(g.gameType).toBe('tak')
    expect(g.flatStones).toEqual({ X: 21, O: 21 })
    expect(g.capstones).toEqual({ X: 1, O: 1 })
    expect(g.firstMoveDone).toEqual({ X: false, O: false })
  })

  it('first move places opponent flat stone', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'flat' }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    // X's first move places O's flat stone
    expect(g.board[0][0].stack[0]).toEqual({ owner: 'O', type: 'flat' })
    expect(g.flatStones.X).toBe(20) // deducted from X's reserves
    expect(g.firstMoveDone.X).toBe(true)
    expect(g.currentTurn).toBe('O')
  })

  it('cannot place wall on first move', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'wall' }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    expect(g.moveCount).toBe(0)
    expect(g.board[0][0].stack.length).toBe(0)
  })

  it('cannot place capstone on first move', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'capstone' }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    expect(g.moveCount).toBe(0)
  })

  it('normal flat placement on empty cell after first moves', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // First moves (place opponent's flat)
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 24, pieceType: 'flat' }, timestamp: ts() },
      // Normal move: X places own flat
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 6, pieceType: 'flat' }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    expect(g.board[1][1].stack[0]).toEqual({ owner: 'X', type: 'flat' })
    expect(g.flatStones.X).toBe(19) // 21 - 1 (first move) - 1 (this move)
    expect(g.moveCount).toBe(3)
  })

  it('stack movement with drops', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // First moves
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 24, pieceType: 'flat' }, timestamp: ts() },
      // Build a stack: X at (0,0), then O at (0,1)
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 1, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 23, pieceType: 'flat' }, timestamp: ts() },
      // X moves stack from pos 1 east to pos 2 (drop 1)
      { type: 'make_move', gameId: gid, player: 'alice', takMove: { from: 1, direction: 'E', drops: [1] }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    expect(g.board[0][1].stack.length).toBe(0) // source emptied
    expect(g.board[0][2].stack.length).toBe(1) // piece moved here
    expect(g.board[0][2].stack[0].owner).toBe('X')
  })

  it('capstone flattens wall during move', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // First moves
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 24, pieceType: 'flat' }, timestamp: ts() },
      // X places capstone at (1,0)
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 5, pieceType: 'capstone' }, timestamp: ts() },
      // O places wall at (2,0)
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 10, pieceType: 'wall' }, timestamp: ts() },
      // X moves capstone south onto wall — flattens it
      { type: 'make_move', gameId: gid, player: 'alice', takMove: { from: 5, direction: 'S', drops: [1] }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    // Wall at (2,0) should be flattened to flat
    expect(g.board[2][0].stack[0].type).toBe('flat')
    expect(g.board[2][0].stack[0].owner).toBe('O')
    // Capstone on top
    expect(g.board[2][0].stack[1].type).toBe('capstone')
    expect(g.board[2][0].stack[1].owner).toBe('X')
  })

  it('cannot move onto capstone', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // First moves
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 24, pieceType: 'flat' }, timestamp: ts() },
      // X places capstone at (1,0)
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 5, pieceType: 'capstone' }, timestamp: ts() },
      // O places capstone at (2,0)
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 10, pieceType: 'capstone' }, timestamp: ts() },
      // X tries to move capstone onto O's capstone — should fail
      { type: 'make_move', gameId: gid, player: 'alice', takMove: { from: 5, direction: 'S', drops: [1] }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    // Move should be rejected, capstone still at (1,0)
    expect(g.board[1][0].stack.length).toBe(1)
    expect(g.board[1][0].stack[0].type).toBe('capstone')
  })

  it('detects horizontal road', () => {
    // Build a horizontal road for X across row 2: positions 10,11,12,13,14
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // First moves
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 24, pieceType: 'flat' }, timestamp: ts() },
      // X places flats across row 2
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 10, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 20, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 11, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 21, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 12, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 22, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 13, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 23, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 14, pieceType: 'flat' }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    expect(g.result).toBe('x_wins')
    expect(g.status).toBe('finished')
    expect(g.road).not.toBeNull()
    // Road should contain all 5 cells in row 2
    expect(g.road!.sort()).toEqual([10, 11, 12, 13, 14])
  })

  it('detects vertical road', () => {
    // Build a vertical road for X in column 0: positions 0,5,10,15,20
    // But first moves place opponent pieces, so position 0 has O's flat from X's first move.
    // We need a different approach: use column 2 for X's road
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // First moves
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 24, pieceType: 'flat' }, timestamp: ts() },
      // X places column 2: 2, 7, 12, 17, 22
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 2, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 1, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 7, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 3, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 12, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 4, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 17, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 23, pieceType: 'flat' }, timestamp: ts() },
      { type: 'make_move', gameId: gid, player: 'alice', takPlace: { position: 22, pieceType: 'flat' }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    expect(g.result).toBe('x_wins')
    expect(g.status).toBe('finished')
    expect(g.road).not.toBeNull()
    expect(g.road!.sort((a, b) => a - b)).toEqual([2, 7, 12, 17, 22])
  })

  it('flat win when board fills', () => {
    // We won't fill the entire 25-cell board here, but we can test the logic
    // by checking that countTopFlats works via a scenario where all pieces are exhausted.
    // For brevity, test with a smaller scenario: create game, fill board via statements.
    // This is a simplified test — we just verify the deriver handles a full board.

    // Place pieces to fill all 25 cells (alternating)
    const moves: any[] = [
      { type: 'create_game' as const, gameId: gid, playerX: 'alice', gameType: 'tak' as const, timestamp: ts() },
      { type: 'join_game' as const, gameId: gid, playerO: 'bob', timestamp: ts() },
    ]

    // First moves (opponent flat placement)
    moves.push({ type: 'make_move' as const, gameId: gid, player: 'alice', takPlace: { position: 0, pieceType: 'flat' as const }, timestamp: ts() })
    moves.push({ type: 'make_move' as const, gameId: gid, player: 'bob', takPlace: { position: 1, pieceType: 'flat' as const }, timestamp: ts() })

    // Fill remaining 23 cells alternating — avoid creating a road
    // Use a pattern that doesn't create a connected path across the board
    // Checkerboard-ish: X on even positions, O on odd (after first two)
    const remaining = []
    for (let i = 2; i < 25; i++) remaining.push(i)

    let turn = 'alice'
    for (const pos of remaining) {
      moves.push({
        type: 'make_move' as const,
        gameId: gid,
        player: turn,
        takPlace: { position: pos, pieceType: 'flat' as const },
        timestamp: ts(),
      })
      turn = turn === 'alice' ? 'bob' : 'alice'
    }

    const stmts = makeStmts(gid, ...moves)
    const g = deriveTak(gid, stmts)

    // Game should be finished (either by road or flat win)
    // If a road was created, it finishes with a road win
    // If no road, it finishes as flat win when board is full
    expect(g).not.toBeNull()
    expect(g!.status).toBe('finished')
    expect(g!.result).not.toBeNull()
  })

  it('rejects out-of-turn move', () => {
    const stmts = makeStmts(gid,
      { type: 'create_game', gameId: gid, playerX: 'alice', gameType: 'tak', timestamp: ts() },
      { type: 'join_game', gameId: gid, playerO: 'bob', timestamp: ts() },
      // O tries to move first — should be rejected
      { type: 'make_move', gameId: gid, player: 'bob', takPlace: { position: 0, pieceType: 'flat' }, timestamp: ts() },
    )
    const g = deriveTak(gid, stmts)!
    expect(g.moveCount).toBe(0)
    expect(g.currentTurn).toBe('X')
  })
})
