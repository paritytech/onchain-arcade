import type { GameStatement, PlayerSymbol } from '@/types/game'
import type { DerivedBlokusDuo } from '@/types/derived-game'
import { initGameState } from '../shared'

const SIZE = 14
const TOTAL_CELLS = SIZE * SIZE // 196

// Starting cells: X must cover (4,4)=60, O must cover (9,9)=135
const START_CELL_X = 4 * SIZE + 4  // 60
const START_CELL_O = 9 * SIZE + 9  // 135

// --- Piece Definitions ---
// Each piece: id, name, shape as [dr, dc][] offsets from anchor

export interface PieceDef {
  id: number
  name: string
  shape: [number, number][]
}

export const PIECES: PieceDef[] = [
  // Monomino
  { id: 0, name: '1', shape: [[0, 0]] },
  // Domino
  { id: 1, name: 'I2', shape: [[0, 0], [0, 1]] },
  // Triominoes
  { id: 2, name: 'I3', shape: [[0, 0], [0, 1], [0, 2]] },
  { id: 3, name: 'L3', shape: [[0, 0], [0, 1], [1, 0]] },
  // Tetrominoes
  { id: 4, name: 'I4', shape: [[0, 0], [0, 1], [0, 2], [0, 3]] },
  { id: 5, name: 'O4', shape: [[0, 0], [0, 1], [1, 0], [1, 1]] },
  { id: 6, name: 'T4', shape: [[0, 0], [0, 1], [0, 2], [1, 1]] },
  { id: 7, name: 'S4', shape: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  { id: 8, name: 'L4', shape: [[0, 0], [0, 1], [0, 2], [1, 0]] },
  // Pentominoes
  { id: 9,  name: 'F5', shape: [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]] },
  { id: 10, name: 'I5', shape: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
  { id: 11, name: 'L5', shape: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0]] },
  { id: 12, name: 'N5', shape: [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]] },
  { id: 13, name: 'P5', shape: [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0]] },
  { id: 14, name: 'T5', shape: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]] },
  { id: 15, name: 'U5', shape: [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2]] },
  { id: 16, name: 'V5', shape: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]] },
  { id: 17, name: 'W5', shape: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]] },
  { id: 18, name: 'X5', shape: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]] },
  { id: 19, name: 'Y5', shape: [[0, 0], [1, 0], [1, 1], [2, 0], [3, 0]] },
  { id: 20, name: 'Z5', shape: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]] },
]

const ALL_PIECE_IDS = PIECES.map(p => p.id)

// --- Transformation ---

export function rotatePiece(shape: [number, number][], rotation: number, flip: boolean): [number, number][] {
  let s = shape.map(([r, c]) => [r, c] as [number, number])

  if (flip) {
    s = s.map(([r, c]) => [r, -c])
  }

  for (let i = 0; i < (rotation % 4); i++) {
    s = s.map(([r, c]) => [c, -r])
  }

  // Normalize to non-negative coordinates
  const minR = Math.min(...s.map(([r]) => r))
  const minC = Math.min(...s.map(([, c]) => c))
  return s.map(([r, c]) => [r - minR, c - minC])
}

export function getCells(position: number, transformedShape: [number, number][]): number[] | null {
  const anchorRow = Math.floor(position / SIZE)
  const anchorCol = position % SIZE
  const cells: number[] = []

  for (const [dr, dc] of transformedShape) {
    const r = anchorRow + dr
    const c = anchorCol + dc
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return null
    cells.push(r * SIZE + c)
  }

  return cells
}

export function isValidPlacement(
  board: (PlayerSymbol | null)[],
  cells: number[],
  player: PlayerSymbol,
  isFirstMove: boolean,
  startCell: number,
): boolean {
  // All cells must be empty
  for (const idx of cells) {
    if (board[idx] !== null) return false
  }

  const cellSet = new Set(cells)

  // Check edge adjacency: none of the placed cells can share an edge with own color
  for (const idx of cells) {
    const r = Math.floor(idx / SIZE)
    const c = idx % SIZE
    const edgeNeighbors: number[] = []
    if (r > 0) edgeNeighbors.push((r - 1) * SIZE + c)
    if (r < SIZE - 1) edgeNeighbors.push((r + 1) * SIZE + c)
    if (c > 0) edgeNeighbors.push(r * SIZE + (c - 1))
    if (c < SIZE - 1) edgeNeighbors.push(r * SIZE + (c + 1))

    for (const n of edgeNeighbors) {
      if (!cellSet.has(n) && board[n] === player) return false
    }
  }

  if (isFirstMove) {
    // Must cover the starting cell
    return cellSet.has(startCell)
  }

  // Must touch own color at corner (diagonal adjacency) for at least one cell
  let hasCornerTouch = false
  for (const idx of cells) {
    const r = Math.floor(idx / SIZE)
    const c = idx % SIZE
    const diagonalNeighbors: number[] = []
    if (r > 0 && c > 0) diagonalNeighbors.push((r - 1) * SIZE + (c - 1))
    if (r > 0 && c < SIZE - 1) diagonalNeighbors.push((r - 1) * SIZE + (c + 1))
    if (r < SIZE - 1 && c > 0) diagonalNeighbors.push((r + 1) * SIZE + (c - 1))
    if (r < SIZE - 1 && c < SIZE - 1) diagonalNeighbors.push((r + 1) * SIZE + (c + 1))

    for (const n of diagonalNeighbors) {
      if (!cellSet.has(n) && board[n] === player) {
        hasCornerTouch = true
        break
      }
    }
    if (hasCornerTouch) break
  }

  return hasCornerTouch
}

// --- Deriver ---

export function deriveBlokusDuo(gameId: string, stmts: GameStatement[]): DerivedBlokusDuo | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const board: (PlayerSymbol | null)[] = Array(TOTAL_CELLS).fill(null)
  const remainingPieces: { X: number[]; O: number[] } = {
    X: [...ALL_PIECE_IDS],
    O: [...ALL_PIECE_IDS],
  }
  let currentTurn: PlayerSymbol = 'X'
  let consecutivePasses = 0
  const firstMoveDone: { X: boolean; O: boolean } = { X: false, O: false }

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== currentTurn) continue

    // Handle pass
    if (stmt.blokusPass) {
      consecutivePasses++
      moveCount++
      updatedAt = stmt.timestamp
      currentTurn = currentTurn === 'X' ? 'O' : 'X'

      if (consecutivePasses >= 2) {
        status = 'finished'
        const scores = countScores(board)
        if (scores.X > scores.O) result = 'x_wins'
        else if (scores.O > scores.X) result = 'o_wins'
        else result = 'draw'
      }
      continue
    }

    // Handle piece placement
    if (!stmt.blokusMove) continue
    const { pieceId, position, rotation, flip } = stmt.blokusMove

    // Validate piece is available
    const pieceList = remainingPieces[symbol]
    const pieceIdx = pieceList.indexOf(pieceId)
    if (pieceIdx === -1) continue

    const pieceDef = PIECES.find(p => p.id === pieceId)
    if (!pieceDef) continue

    const transformed = rotatePiece(pieceDef.shape, rotation, flip)
    const cells = getCells(position, transformed)
    if (!cells) continue

    const isFirstMove = !firstMoveDone[symbol]
    const startCell = symbol === 'X' ? START_CELL_X : START_CELL_O

    if (!isValidPlacement(board, cells, symbol, isFirstMove, startCell)) continue

    // Apply placement
    for (const idx of cells) {
      board[idx] = symbol
    }
    pieceList.splice(pieceIdx, 1)
    firstMoveDone[symbol] = true
    consecutivePasses = 0
    moveCount++
    updatedAt = stmt.timestamp
    currentTurn = currentTurn === 'X' ? 'O' : 'X'
  }

  const scores = countScores(board)

  return {
    id: gameId,
    gameType: 'blokus-duo',
    board,
    remainingPieces,
    scores,
    consecutivePasses,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: init.playerO,
    playerOName: init.playerOName,
    currentTurn,
    status,
    result,
    moveCount,
    vsComputer: create.vsComputer ?? false,
    createdAt: create.timestamp,
    updatedAt,
  }
}

function countScores(board: (PlayerSymbol | null)[]): { X: number; O: number } {
  let X = 0, O = 0
  for (const cell of board) {
    if (cell === 'X') X++
    else if (cell === 'O') O++
  }
  return { X, O }
}
