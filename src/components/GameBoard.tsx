import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { CellValue, PlayerSymbol } from '@/types/game'

interface GameBoardProps {
  board: CellValue[]
  currentTurn: PlayerSymbol
  winningLine: number[] | null
  isMyTurn: boolean
  isPlayable: boolean
  onCellClick: (index: number) => void
}

function XMark({ isWinning }: { isWinning: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={cn('w-10 h-10 md:w-14 md:h-14', isWinning ? 'text-brand' : 'text-text-primary')}
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

function OMark({ isWinning }: { isWinning: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={cn('w-10 h-10 md:w-14 md:h-14', isWinning ? 'text-brand' : 'text-text-secondary')}
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

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function getWinningLine(board: CellValue[]): number[] | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c]
    }
  }
  return null
}

export function GameBoard({ board, winningLine, isMyTurn, isPlayable, onCellClick }: GameBoardProps) {
  const resolvedWinLine = winningLine ?? getWinningLine(board)

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 md:gap-3 w-fit mx-auto">
        {board.map((cell, index) => {
          const isWinning = resolvedWinLine?.includes(index) ?? false
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
                'w-24 h-24 md:w-28 md:h-28 rounded-xl flex items-center justify-center',
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
              {cell === 'X' && <XMark isWinning={isWinning} />}
              {cell === 'O' && <OMark isWinning={isWinning} />}
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
