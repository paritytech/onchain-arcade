import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { CellValue, PlayerSymbol, GridSize } from '@/types/game'

interface GameBoardProps {
  board: CellValue[]
  gridSize: GridSize
  currentTurn: PlayerSymbol
  winningLine: number[] | null
  isMyTurn: boolean
  isPlayable: boolean
  onCellClick: (index: number) => void
}

function XMark({ isWinning, small }: { isWinning: boolean; small?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={cn(small ? 'w-6 h-6' : 'w-10 h-10 md:w-14 md:h-14', isWinning ? 'text-brand' : 'text-text-primary')}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.line
        x1="16" y1="16" x2="48" y2="48"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="48" y1="16" x2="16" y2="48"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
    </motion.svg>
  )
}

function OMark({ isWinning, small }: { isWinning: boolean; small?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={cn(small ? 'w-6 h-6' : 'w-10 h-10 md:w-14 md:h-14', isWinning ? 'text-brand' : 'text-text-secondary')}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.circle
        cx="32" cy="32" r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.svg>
  )
}

const cellSizes: Record<GridSize, string> = {
  3: 'w-24 h-24 md:w-28 md:h-28',
  5: 'w-16 h-16 md:w-20 md:h-20',
  7: 'w-12 h-12 md:w-16 md:h-16',
}

export function GameBoard({ board, gridSize, winningLine, isMyTurn, isPlayable, onCellClick }: GameBoardProps) {
  const small = gridSize >= 5

  return (
    <div className="relative">
      <div
        className="grid gap-1.5 md:gap-2 w-fit mx-auto"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {board.map((cell, index) => {
          const isWinning = winningLine?.includes(index) ?? false
          const isEmpty = cell === null
          const canClick = isEmpty && isMyTurn && isPlayable

          return (
            <motion.button
              key={index}
              onClick={() => canClick && onCellClick(index)}
              disabled={!canClick}
              whileHover={canClick ? { scale: 1.05 } : undefined}
              whileTap={canClick ? { scale: 0.95 } : undefined}
              className={cn(
                cellSizes[gridSize],
                'rounded-xl flex items-center justify-center',
                'border-2 transition-all duration-200',
                isWinning
                  ? 'border-brand bg-brand-soft shadow-lg shadow-brand/20'
                  : 'border-grey-200 dark:border-grey-700 bg-white dark:bg-grey-800/50',
                canClick && 'cursor-pointer hover:border-brand/50 hover:bg-brand-soft/30',
                !canClick && 'cursor-default'
              )}
              aria-label={
                cell
                  ? `Cell ${index + 1}: ${cell}`
                  : `Cell ${index + 1}: empty${canClick ? ', click to place your mark' : ''}`
              }
            >
              {cell === 'X' && <XMark isWinning={isWinning} small={small} />}
              {cell === 'O' && <OMark isWinning={isWinning} small={small} />}
            </motion.button>
          )
        })}
      </div>

      {/* Glow effect behind board */}
      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-br from-brand via-transparent to-brand/30 rounded-3xl"
        aria-hidden="true"
      />
    </div>
  )
}
