import type { EntropyColor } from '@/types/derived-game'
import { scoreBoard, getValidSlideTargets } from './deriver'

type EntropyMove =
  | { entropyPlace: number }
  | { entropySlide: { from: number; to: number } }
  | { entropyPass: true }

/**
 * Greedy AI for Entropy.
 * - As Chaos: pick the cell that minimizes the board score (Chaos wants low score).
 * - As Order: pick the slide that maximizes the board score (Order wants high score).
 *   Pass if no slide improves the score.
 */
export function getBestEntropyMove(
  board: (EntropyColor | null)[],
  nextPiece: EntropyColor | null,
  phase: 'chaos' | 'order',
  _piecesPlaced: number,
): EntropyMove {
  const SIZE = 7
  const TOTAL = SIZE * SIZE

  if (phase === 'chaos') {
    if (!nextPiece) return { entropyPass: true }

    let bestCell = -1
    let bestScore = Infinity

    for (let i = 0; i < TOTAL; i++) {
      if (board[i] !== null) continue
      // Simulate placing piece
      const sim = [...board]
      sim[i] = nextPiece
      const s = scoreBoard(sim)
      if (s < bestScore) {
        bestScore = s
        bestCell = i
      }
    }

    if (bestCell === -1) return { entropyPass: true }
    return { entropyPlace: bestCell }
  } else {
    // Order: find best slide
    const currentScore = scoreBoard(board)
    let bestFrom = -1
    let bestTo = -1
    let bestScore = currentScore

    for (let i = 0; i < TOTAL; i++) {
      if (board[i] === null) continue
      const targets = getValidSlideTargets(board, i)
      for (const t of targets) {
        const sim = [...board]
        sim[t] = sim[i]
        sim[i] = null
        const s = scoreBoard(sim)
        if (s > bestScore) {
          bestScore = s
          bestFrom = i
          bestTo = t
        }
      }
    }

    if (bestFrom === -1) return { entropyPass: true }
    return { entropySlide: { from: bestFrom, to: bestTo } }
  }
}
