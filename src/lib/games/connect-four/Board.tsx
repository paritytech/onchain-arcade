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

function Disc({ value, isWinning }: { value: 'X' | 'O'; isWinning: boolean }) {
  const color = value === 'X'
    ? isWinning ? 'bg-red-400 shadow-red-400/40' : 'bg-red-500'
    : isWinning ? 'bg-yellow-300 shadow-yellow-300/40' : 'bg-yellow-400'

  return (
    <motion.div
      className={cn('w-10 h-10 md:w-12 md:h-12 rounded-full', color, isWinning && 'shadow-lg')}
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
                  currentTurn === 'X' ? 'bg-red-500' : 'bg-yellow-400'
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
        className="grid gap-1.5 md:gap-2 w-fit mx-auto bg-blue-800 dark:bg-blue-900 p-3 md:p-4 rounded-2xl"
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
                'bg-blue-900 dark:bg-grey-900 transition-all duration-150',
                isWinning && 'ring-2 ring-brand',
                canClick(col) && 'cursor-pointer hover:bg-blue-800 dark:hover:bg-grey-800',
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
