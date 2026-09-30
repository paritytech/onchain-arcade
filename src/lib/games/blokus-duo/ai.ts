import type { PlayerSymbol } from '@/types/game'
import { PIECES, rotatePiece, getCells, isValidPlacement } from './deriver'

const SIZE = 14
const START_CELL_X = 60
const START_CELL_O = 135

interface BlokusMoveResult {
  blokusMove: { pieceId: number; position: number; rotation: number; flip: boolean }
}

interface BlokusPassResult {
  blokusPass: true
}

/**
 * Greedy AI: tries all valid placements, prefers larger pieces.
 * Score = number of squares in piece x 10.
 */
export function getBestBlokusMove(
  board: (PlayerSymbol | null)[],
  remainingPieces: number[],
  player: PlayerSymbol,
  isFirstMove: boolean,
): BlokusMoveResult | BlokusPassResult {
  const startCell = player === 'X' ? START_CELL_X : START_CELL_O

  let bestScore = -1
  let bestMove: BlokusMoveResult | null = null

  // Sort pieces by size descending for early pruning
  const sortedPieces = [...remainingPieces].sort((a, b) => {
    const sizeA = PIECES[a]?.shape.length ?? 0
    const sizeB = PIECES[b]?.shape.length ?? 0
    return sizeB - sizeA
  })

  for (const pieceId of sortedPieces) {
    const pieceDef = PIECES.find(p => p.id === pieceId)
    if (!pieceDef) continue

    const score = pieceDef.shape.length * 10

    // Skip if this piece can't beat our best
    if (score <= bestScore) continue

    for (let rot = 0; rot < 4; rot++) {
      for (const doFlip of [false, true]) {
        const transformed = rotatePiece(pieceDef.shape, rot, doFlip)

        // Only try positions near existing pieces or start cell
        const candidatePositions = isFirstMove
          ? getCandidatePositionsFirstMove(startCell, transformed)
          : getCandidatePositionsNear(board, player, transformed)

        for (const pos of candidatePositions) {
          const cells = getCells(pos, transformed)
          if (!cells) continue
          if (!isValidPlacement(board, cells, player, isFirstMove, startCell)) continue

          bestScore = score
          bestMove = {
            blokusMove: { pieceId, position: pos, rotation: rot, flip: doFlip },
          }
          // Found a valid placement for this piece size, move to next size class
          break
        }
        if (bestScore === score && bestMove?.blokusMove.pieceId === pieceId) break
      }
      if (bestScore === score && bestMove?.blokusMove.pieceId === pieceId) break
    }
  }

  if (bestMove) return bestMove
  return { blokusPass: true }
}

/** For first move, only try positions where the piece covers the start cell */
function getCandidatePositionsFirstMove(
  startCell: number,
  shape: [number, number][],
): number[] {
  const positions: number[] = []
  const startRow = Math.floor(startCell / SIZE)
  const startCol = startCell % SIZE

  for (const [dr, dc] of shape) {
    const anchorRow = startRow - dr
    const anchorCol = startCol - dc
    if (anchorRow >= 0 && anchorRow < SIZE && anchorCol >= 0 && anchorCol < SIZE) {
      positions.push(anchorRow * SIZE + anchorCol)
    }
  }

  return [...new Set(positions)]
}

/** For subsequent moves, try positions near diagonal neighbors of own pieces */
function getCandidatePositionsNear(
  board: (PlayerSymbol | null)[],
  player: PlayerSymbol,
  shape: [number, number][],
): number[] {
  // Find all diagonal neighbors of player's existing pieces that are empty
  const cornerCells = new Set<number>()
  for (let idx = 0; idx < board.length; idx++) {
    if (board[idx] !== player) continue
    const r = Math.floor(idx / SIZE)
    const c = idx % SIZE
    const diags = [
      [r - 1, c - 1], [r - 1, c + 1],
      [r + 1, c - 1], [r + 1, c + 1],
    ]
    for (const [dr, dc] of diags) {
      if (dr >= 0 && dr < SIZE && dc >= 0 && dc < SIZE) {
        const nIdx = dr * SIZE + dc
        if (board[nIdx] === null) cornerCells.add(nIdx)
      }
    }
  }

  // For each corner cell, try anchor positions where the piece covers it
  const positions = new Set<number>()
  for (const target of cornerCells) {
    const targetRow = Math.floor(target / SIZE)
    const targetCol = target % SIZE
    for (const [dr, dc] of shape) {
      const anchorRow = targetRow - dr
      const anchorCol = targetCol - dc
      if (anchorRow >= 0 && anchorRow < SIZE && anchorCol >= 0 && anchorCol < SIZE) {
        positions.add(anchorRow * SIZE + anchorCol)
      }
    }
  }

  return [...positions]
}
