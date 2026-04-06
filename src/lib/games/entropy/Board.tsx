import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { EntropyColor } from '@/types/derived-game'
import type { PlayerSymbol } from '@/types/game'

const COLOR_MAP: Record<EntropyColor, string> = {
  R: 'bg-red-500',
  G: 'bg-emerald-500',
  B: 'bg-blue-500',
  Y: 'bg-yellow-400',
  P: 'bg-purple-500',
}

const COLOR_LABEL: Record<EntropyColor, string> = {
  R: 'Red',
  G: 'Green',
  B: 'Blue',
  Y: 'Yellow',
  P: 'Purple',
}

interface EntropyBoardProps {
  board: (EntropyColor | null)[]
  nextPiece: EntropyColor | null
  piecesPlaced: number
  round: 1 | 2
  phase: 'chaos' | 'order'
  scores: { X: number; O: number }
  chaosPlayer: PlayerSymbol
  isMyTurn: boolean
  isPlayable: boolean
  onPlace: (cellIndex: number) => void
  onSlide: (from: number, to: number) => void
  onPassSlide: () => void
}

export function EntropyBoard({
  board,
  nextPiece,
  piecesPlaced,
  round,
  phase,
  scores,
  
  isMyTurn,
  isPlayable,
  onPlace,
  onSlide,
  onPassSlide,
}: EntropyBoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const canClick = isMyTurn && isPlayable

  

  // Compute valid slide targets for selected piece
  const validTargets = new Set<number>()
  if (selectedPiece !== null && phase === 'order') {
    const row = Math.floor(selectedPiece / 7)
    const col = selectedPiece % 7
    const directions = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ]
    for (const { dr, dc } of directions) {
      let r = row + dr
      let c = col + dc
      while (r >= 0 && r < 7 && c >= 0 && c < 7) {
        const idx = r * 7 + c
        if (board[idx] !== null) break
        validTargets.add(idx)
        r += dr
        c += dc
      }
    }
  }

  function handleCellClick(index: number) {
    if (!canClick) return

    if (phase === 'chaos') {
      if (board[index] === null) {
        onPlace(index)
      }
    } else {
      // Order mode
      if (selectedPiece !== null) {
        if (validTargets.has(index)) {
          onSlide(selectedPiece, index)
          setSelectedPiece(null)
        } else if (board[index] !== null) {
          setSelectedPiece(index)
        } else {
          setSelectedPiece(null)
        }
      } else {
        if (board[index] !== null) {
          setSelectedPiece(index)
        }
      }
    }
  }

  const iAmChaos = phase === 'chaos'
  const roleLabel = iAmChaos ? 'Chaos places' : 'Order slides'
  const piecesRemaining = 35 - piecesPlaced

  return (
    <div className="space-y-3">
      {/* Round and role indicator */}
      <div className="text-center text-body-sm font-semibold text-text">
        Round {round} — {roleLabel}
      </div>

      {/* Scores */}
      <div className="flex justify-center gap-6 text-body-sm font-semibold">
        <span className="text-text">X: {scores.X} pts</span>
        <span className="text-text">O: {scores.O} pts</span>
      </div>

      {/* Next piece indicator */}
      {nextPiece && phase === 'chaos' && (
        <div className="flex items-center justify-center gap-2 text-body-sm text-text">
          <span>Next piece:</span>
          <div className={cn('w-6 h-6 rounded-full', COLOR_MAP[nextPiece])} />
          <span>{COLOR_LABEL[nextPiece]}</span>
          <span className="ml-2 text-text/60">({piecesRemaining} remaining)</span>
        </div>
      )}

      {/* Pieces remaining for order phase */}
      {phase === 'order' && (
        <div className="text-center text-body-sm text-text/60">
          {piecesRemaining} pieces remaining
        </div>
      )}

      {/* Board */}
      <div className="relative">
        <div
          className="grid gap-0.5 w-fit mx-auto bg-grey-800 dark:bg-grey-900 p-2 rounded-xl"
          style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
        >
          {board.map((cell, index) => {
            const isSelected = selectedPiece === index
            const isValidTarget = validTargets.has(index)
            const clickable = canClick && (
              (phase === 'chaos' && cell === null) ||
              (phase === 'order' && (cell !== null || isValidTarget))
            )

            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!canClick}
                className={cn(
                  'w-10 h-10 md:w-11 md:h-11 flex items-center justify-center',
                  'bg-grey-700 dark:bg-grey-800 transition-colors rounded-sm',
                  clickable && 'cursor-pointer hover:bg-grey-600',
                  !canClick && 'cursor-default',
                  isSelected && 'ring-2 ring-yellow-400',
                  isValidTarget && canClick && 'bg-grey-600/50',
                )}
                aria-label={
                  cell ? `${COLOR_LABEL[cell]} piece` :
                  isValidTarget ? 'Valid slide target' :
                  'Empty cell'
                }
              >
                {cell ? (
                  <motion.div
                    className={cn('w-8 h-8 md:w-9 md:h-9 rounded-full', COLOR_MAP[cell])}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                ) : isValidTarget && canClick ? (
                  <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                ) : null}
              </button>
            )
          })}
        </div>

        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-15 bg-gradient-to-br from-purple-500 via-transparent to-blue-500/30 rounded-3xl"
          aria-hidden="true"
        />
      </div>

      {/* Pass button for Order */}
      {phase === 'order' && canClick && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setSelectedPiece(null)
              onPassSlide()
            }}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-text text-body-sm font-medium hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors"
          >
            Pass (no slide)
          </button>
        </div>
      )}
    </div>
  )
}
