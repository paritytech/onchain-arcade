import type { GameStatement, PlayerSymbol, CellValue } from '@/types/game'
import type { DerivedReversi } from '@/types/derived-game'
import { initGameState } from '../shared'

const SIZE = 8
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
]

function initialBoard(): CellValue[] {
  const board: CellValue[] = Array(64).fill(null)
  board[27] = 'O' // (3,3)
  board[28] = 'X' // (3,4)
  board[35] = 'X' // (4,3)
  board[36] = 'O' // (4,4)
  return board
}

export function getFlips(board: CellValue[], index: number, player: PlayerSymbol): number[] {
  if (board[index] !== null) return []
  const row = Math.floor(index / SIZE), col = index % SIZE
  const opponent: PlayerSymbol = player === 'X' ? 'O' : 'X'
  const allFlips: number[] = []

  for (const [dr, dc] of DIRECTIONS) {
    const flips: number[] = []
    let r = row + dr, c = col + dc
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
      const idx = r * SIZE + c
      if (board[idx] === opponent) {
        flips.push(idx)
      } else if (board[idx] === player) {
        allFlips.push(...flips)
        break
      } else {
        break // empty cell
      }
      r += dr
      c += dc
    }
  }
  return allFlips
}

export function computeValidMoves(board: CellValue[], player: PlayerSymbol): number[] {
  const moves: number[] = []
  for (let i = 0; i < 64; i++) {
    if (board[i] === null && getFlips(board, i, player).length > 0) {
      moves.push(i)
    }
  }
  return moves
}

function countDiscs(board: CellValue[]): { X: number; O: number } {
  let X = 0, O = 0
  for (const cell of board) {
    if (cell === 'X') X++
    else if (cell === 'O') O++
  }
  return { X, O }
}

export function deriveReversi(gameId: string, stmts: GameStatement[]): DerivedReversi | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const board = initialBoard()
  let currentTurn: PlayerSymbol = 'X'
  let skippedLastTurn = false

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue
    if (stmt.cellIndex == null) continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== currentTurn) continue

    const flips = getFlips(board, stmt.cellIndex, symbol)
    if (flips.length === 0) continue // invalid move

    board[stmt.cellIndex] = symbol
    for (const idx of flips) board[idx] = symbol
    moveCount++
    updatedAt = stmt.timestamp

    // Determine next turn
    const opponent: PlayerSymbol = currentTurn === 'X' ? 'O' : 'X'
    const opponentMoves = computeValidMoves(board, opponent)
    if (opponentMoves.length > 0) {
      currentTurn = opponent
      skippedLastTurn = false
    } else {
      const myMoves = computeValidMoves(board, currentTurn)
      if (myMoves.length > 0) {
        skippedLastTurn = true
        // currentTurn stays
      } else {
        // Neither can move — game over
        status = 'finished'
        const scores = countDiscs(board)
        if (scores.X > scores.O) result = 'x_wins'
        else if (scores.O > scores.X) result = 'o_wins'
        else result = 'draw'
      }
    }
  }

  const validMoves = status === 'playing' ? computeValidMoves(board, currentTurn) : []
  const scores = countDiscs(board)

  return {
    id: gameId,
    gameType: 'reversi',
    board,
    validMoves,
    skippedLastTurn,
    scores,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: init.playerO,
    playerOName: init.playerOName,
    currentTurn,
    status,
    result,
    moveCount,
    createdAt: create.timestamp,
    updatedAt,
  }
}
