import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { CellValue, PlayerSymbol } from '@/types/game'
import { C4_ROWS, C4_COLS } from './deriver'

interface ConnectFourBoardProps {
  board: CellValue[]
  currentTurn: PlayerSymbol
  winningLine: number[] | null
  isMyTurn: boolean
  isPlayable: boolean
  onColumnClick: (col: number) => void
}

/**
 * A disc, distinguished by SHAPE as well as colour: X is solid, O is a ring.
 *
 * Colour alone is not enough here and that is measurable, not a matter of
 * taste. The two player colours are Okabe-Ito, which maximises hue separation
 * under colour-vision deficiency — but their luminance contrast against each
 * other is 1.34:1, well under the 3:1 that WCAG 1.4.11 asks for adjacent parts
 * of a graphic. No pair in the Okabe-Ito set clears both that bar and the bar
 * against the board itself (yellow/blue manages 3.92:1 between pieces and then
 * disappears on a light background at 1.27:1). So the shape carries the
 * identity and the colour reinforces it, which is the rule anyway.
 */
function Disc({ value, isWinning }: { value: 'X' | 'O'; isWinning: boolean }) {
  const solid = value === 'X'
  return (
    <motion.div
      className={cn(
        'w-10 h-10 md:w-12 md:h-12 rounded-full',
        solid
          ? 'bg-player-x'
          // A ring: transparent centre with a thick border, so the two read
          // apart in greyscale and under every CVD simulation.
          : 'bg-transparent border-[6px] md:border-[7px] border-player-o',
        isWinning && 'shadow-lg ring-2 ring-white/70',
      )}
      role="img"
      aria-label={solid ? 'Player X disc' : 'Player O disc'}
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    />
  )
}

export function ConnectFourBoard({ board, currentTurn, winningLine, isMyTurn, isPlayable, onColumnClick }: ConnectFourBoardProps) {
  const [hoverCol, setHoverCol] = useState<number | null>(null)

  const isColumnFull = (col: number) => board[col] !== null // top row cell

  const canClick = (col: number) => isMyTurn && isPlayable && !isColumnFull(col)

  return (
    <div className="relative">
      {/* Column hover indicators */}
      <div className="grid gap-1.5 md:gap-2 w-fit mx-auto mb-2" style={{ gridTemplateColumns: `repeat(${C4_COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: C4_COLS }, (_, col) => (
          <div key={col} className="w-14 h-6 md:w-16 md:h-6 flex items-center justify-center">
            {hoverCol === col && canClick(col) && (
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full opacity-40',
                  currentTurn === 'X' ? 'bg-player-x' : 'bg-player-o'
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Board */}
      <div
        className="grid gap-1.5 md:gap-2 w-fit mx-auto bg-blue-700 dark:bg-blue-900 p-3 md:p-4 rounded-2xl"
        style={{ gridTemplateColumns: `repeat(${C4_COLS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: C4_ROWS * C4_COLS }, (_, index) => {
          const col = index % C4_COLS
          const cell = board[index]
          const isWinning = winningLine?.includes(index) ?? false

          return (
            <button
              key={index}
              onClick={() => canClick(col) && onColumnClick(col)}
              onMouseEnter={() => setHoverCol(col)}
              onMouseLeave={() => setHoverCol(null)}
              disabled={!canClick(col)}
              className={cn(
                'w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center',
                // Neutral, not navy. The holes were blue-900 in light mode,
                // which was fine against a red disc (2.75:1) and is not against
                // an Okabe-Ito blue one: 2.00:1, and blue-on-navy by hue too.
                // grey-900 clears 3:1 against both pieces (3.37 and 4.52).
                'bg-grey-900 transition-all duration-150',
                isWinning && 'ring-2 ring-brand',
                canClick(col) && 'cursor-pointer hover:bg-grey-800',
                !canClick(col) && 'cursor-default'
              )}
              aria-label={
                cell
                  ? `Row ${Math.floor(index / C4_COLS) + 1}, Column ${col + 1}: ${cell}`
                  : `Column ${col + 1}: empty${canClick(col) ? ', click to drop disc' : ''}`
              }
            >
              {cell && <Disc value={cell} isWinning={isWinning} />}
            </button>
          )
        })}
      </div>

      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-br from-blue-500 via-transparent to-blue-500/30 rounded-3xl"
        aria-hidden="true"
      />
    </div>
  )
}
