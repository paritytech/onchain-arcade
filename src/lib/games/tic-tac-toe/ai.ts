import type { CellValue, PlayerSymbol, GridSize } from '@/types/game'
import { checkWinner, isBoardFull } from '@/types/game'

/**
 * Minimax AI for Tic-Tac-Toe.
 * Perfect play on 3x3. Reasonable on larger grids (depth-limited).
 */

function evaluate(board: CellValue[], gridSize: GridSize, maximizer: PlayerSymbol): number {
  const { winner } = checkWinner(board, gridSize)
  if (winner === maximizer) return 10
  if (winner !== null) return -10
  return 0
}

function minimax(
  board: CellValue[],
  gridSize: GridSize,
  depth: number,
  isMaximizing: boolean,
  maximizer: PlayerSymbol,
  alpha: number,
  beta: number,
): number {
  const score = evaluate(board, gridSize, maximizer)
  if (score !== 0 || isBoardFull(board) || depth === 0) return score

  const opponent: PlayerSymbol = maximizer === 'X' ? 'O' : 'X'

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null) continue
      board[i] = maximizer
      best = Math.max(best, minimax(board, gridSize, depth - 1, false, maximizer, alpha, beta))
      board[i] = null
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null) continue
      board[i] = opponent
      best = Math.min(best, minimax(board, gridSize, depth - 1, true, maximizer, alpha, beta))
      board[i] = null
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

/**
 * Get the best move for the given player.
 * Returns the cell index to play.
 */
export function getBestMove(board: CellValue[], gridSize: GridSize, player: PlayerSymbol): number {
  const boardCopy = [...board]
  // Depth limit: 3x3 = full search, 5x5 = depth 6, 7x7 = depth 4
  const maxDepth = gridSize === 3 ? 9 : gridSize === 5 ? 6 : 4

  let bestScore = -Infinity
  let bestMove = -1

  for (let i = 0; i < boardCopy.length; i++) {
    if (boardCopy[i] !== null) continue
    boardCopy[i] = player
    const score = minimax(boardCopy, gridSize, maxDepth - 1, false, player, -Infinity, Infinity)
    boardCopy[i] = null
    if (score > bestScore) {
      bestScore = score
      bestMove = i
    }
  }

  // Fallback: pick first empty cell (shouldn't happen)
  if (bestMove === -1) {
    bestMove = board.findIndex(c => c === null)
  }

  return bestMove
}
