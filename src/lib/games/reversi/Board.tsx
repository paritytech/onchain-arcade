import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { CellValue, PlayerSymbol } from '@/types/game'

interface ReversiBoardProps {
  board: CellValue[]
  validMoves: number[]
  scores: { X: number; O: number }
  currentTurn: PlayerSymbol
  isMyTurn: boolean
  isPlayable: boolean
  onCellClick: (index: number) => void
}

function Disc({ value }: { value: 'X' | 'O' }) {
  return (
    <motion.div
      className={cn(
        'w-8 h-8 md:w-9 md:h-9 rounded-full',
        value === 'X' ? 'bg-grey-900 border-2 border-grey-600' : 'bg-grey-100 border-2 border-grey-300',
      )}
      initial={{ scale: 0, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  )
}

export function ReversiBoard({ board, validMoves, scores, currentTurn, isMyTurn, isPlayable, onCellClick }: ReversiBoardProps) {
  const validSet = new Set(validMoves)
  const canClick = isMyTurn && isPlayable

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-6 text-body-sm font-semibold">
        <span className="text-grey-700 dark:text-grey-300">X (Dark): {scores.X}</span>
        <span className="text-grey-500 dark:text-grey-100">O (Light): {scores.O}</span>
      </div>

      <div className="relative">
        <div
          className="grid gap-0.5 w-fit mx-auto bg-emerald-800 dark:bg-emerald-900 p-2 rounded-xl"
          style={{ gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}
        >
          {board.map((cell, index) => {
            const isValid = validSet.has(index)
            const clickable = canClick && isValid

            return (
              <button
                key={index}
                onClick={() => clickable && onCellClick(index)}
                disabled={!clickable}
                className={cn(
                  'w-10 h-10 md:w-11 md:h-11 flex items-center justify-center',
                  'bg-emerald-700 dark:bg-emerald-800 transition-colors',
                  clickable && 'cursor-pointer hover:bg-emerald-600',
                  !clickable && 'cursor-default',
                )}
                aria-label={
                  cell ? `${cell} disc` :
                  isValid ? 'Valid move' :
                  'Empty'
                }
              >
                {cell ? (
                  <Disc value={cell} />
                ) : isValid && canClick ? (
                  <div className={cn(
                    'w-3 h-3 rounded-full opacity-40',
                    currentTurn === 'X' ? 'bg-grey-800' : 'bg-grey-200',
                  )} />
                ) : null}
              </button>
            )
          })}
        </div>

        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-15 bg-gradient-to-br from-emerald-500 via-transparent to-emerald-500/30 rounded-3xl"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
