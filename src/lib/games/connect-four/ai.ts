import type { CellValue, PlayerSymbol } from '@/types/game'
import { C4_ROWS, C4_COLS, dropDisc } from './deriver'

const MAX_DEPTH = 6

function getValidColumns(board: CellValue[]): number[] {
  const cols: number[] = []
  for (let c = 0; c < C4_COLS; c++) {
    if (board[c] === null) cols.push(c) // top row empty = column not full
  }
  return cols
}

function checkWinC4(board: CellValue[]): PlayerSymbol | null {
  const check = (indices: number[]) => {
    const f = board[indices[0]]
    return f && indices.every(i => board[i] === f) ? f as PlayerSymbol : null
  }
  for (let r = 0; r < C4_ROWS; r++) {
    for (let c = 0; c < C4_COLS; c++) {
      const idx = r * C4_COLS + c
      if (c <= C4_COLS - 4) { const w = check([idx, idx+1, idx+2, idx+3]); if (w) return w }
      if (r <= C4_ROWS - 4) { const w = check([idx, idx+C4_COLS, idx+2*C4_COLS, idx+3*C4_COLS]); if (w) return w }
      if (r <= C4_ROWS - 4 && c <= C4_COLS - 4) { const w = check([idx, idx+C4_COLS+1, idx+2*(C4_COLS+1), idx+3*(C4_COLS+1)]); if (w) return w }
      if (r <= C4_ROWS - 4 && c >= 3) { const w = check([idx, idx+C4_COLS-1, idx+2*(C4_COLS-1), idx+3*(C4_COLS-1)]); if (w) return w }
    }
  }
  return null
}

function evaluate(board: CellValue[], maximizer: PlayerSymbol): number {
  const winner = checkWinC4(board)
  if (winner === maximizer) return 10000
  if (winner !== null) return -10000

  // Heuristic: score partial lines (2 or 3 in a row with open space)
  let score = 0

  // Prefer center column
  for (let r = 0; r < C4_ROWS; r++) {
    if (board[r * C4_COLS + 3] === maximizer) score += 3
  }

  return score
}

function minimax(board: CellValue[], depth: number, isMax: boolean, player: PlayerSymbol, alpha: number, beta: number): number {
  const winner = checkWinC4(board)
  if (winner) return winner === player ? 10000 + depth : -10000 - depth
  const cols = getValidColumns(board)
  if (cols.length === 0 || depth === 0) return evaluate(board, player)

  const opp: PlayerSymbol = player === 'X' ? 'O' : 'X'

  if (isMax) {
    let best = -Infinity
    for (const col of cols) {
      const b = [...board]
      dropDisc(b, col, player)
      best = Math.max(best, minimax(b, depth - 1, false, player, alpha, beta))
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const col of cols) {
      const b = [...board]
      dropDisc(b, col, opp)
      best = Math.min(best, minimax(b, depth - 1, true, player, alpha, beta))
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

export function getBestColumnMove(board: CellValue[], player: PlayerSymbol): number {
  const cols = getValidColumns(board)
  if (cols.length === 0) return -1

  let bestScore = -Infinity
  let bestCol = cols[0]

  // Try center first for better pruning
  const sorted = [...cols].sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3))

  for (const col of sorted) {
    const b = [...board]
    dropDisc(b, col, player)
    const score = minimax(b, MAX_DEPTH - 1, false, player, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestCol = col
    }
  }

  return bestCol
}
