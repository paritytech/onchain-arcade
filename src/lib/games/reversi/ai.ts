import type { CellValue, PlayerSymbol } from '@/types/game'
import { getFlips, computeValidMoves } from './deriver'

const MAX_DEPTH = 5

// Positional weights for 8x8 board — corners are king
const WEIGHTS = [
  100, -20,  10,   5,   5,  10, -20, 100,
  -20, -50,  -2,  -2,  -2,  -2, -50, -20,
   10,  -2,   1,   1,   1,   1,  -2,  10,
    5,  -2,   1,   1,   1,   1,  -2,   5,
    5,  -2,   1,   1,   1,   1,  -2,   5,
   10,  -2,   1,   1,   1,   1,  -2,  10,
  -20, -50,  -2,  -2,  -2,  -2, -50, -20,
  100, -20,  10,   5,   5,  10, -20, 100,
]

function evaluate(board: CellValue[], maximizer: PlayerSymbol): number {
  const opp: PlayerSymbol = maximizer === 'X' ? 'O' : 'X'
  let score = 0
  for (let i = 0; i < 64; i++) {
    if (board[i] === maximizer) score += WEIGHTS[i]
    else if (board[i] === opp) score -= WEIGHTS[i]
  }
  return score
}

function applyMove(board: CellValue[], index: number, player: PlayerSymbol): CellValue[] {
  const b = [...board]
  const flips = getFlips(b, index, player)
  if (flips.length === 0) return b
  b[index] = player
  for (const idx of flips) b[idx] = player
  return b
}

function minimax(board: CellValue[], depth: number, isMax: boolean, maximizer: PlayerSymbol, alpha: number, beta: number): number {
  const opp: PlayerSymbol = maximizer === 'X' ? 'O' : 'X'
  const current = isMax ? maximizer : opp
  const moves = computeValidMoves(board, current)

  if (depth === 0) return evaluate(board, maximizer)

  if (moves.length === 0) {
    // Pass — check if opponent can move
    const oppMoves = computeValidMoves(board, isMax ? opp : maximizer)
    if (oppMoves.length === 0) {
      // Game over — evaluate final position
      return evaluate(board, maximizer) * 100 // amplify endgame score
    }
    // Pass turn
    return minimax(board, depth - 1, !isMax, maximizer, alpha, beta)
  }

  if (isMax) {
    let best = -Infinity
    for (const move of moves) {
      const b = applyMove(board, move, current)
      best = Math.max(best, minimax(b, depth - 1, false, maximizer, alpha, beta))
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const move of moves) {
      const b = applyMove(board, move, current)
      best = Math.min(best, minimax(b, depth - 1, true, maximizer, alpha, beta))
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

export function getBestReversiMove(board: CellValue[], player: PlayerSymbol, validMoves: number[]): number {
  if (validMoves.length === 0) return -1
  if (validMoves.length === 1) return validMoves[0]

  let bestScore = -Infinity
  let bestMove = validMoves[0]

  for (const move of validMoves) {
    const b = applyMove(board, move, player)
    const score = minimax(b, MAX_DEPTH - 1, false, player, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
