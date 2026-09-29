import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface MancalaBoardProps {
  pits: number[]
  lastSowEnd: number | null
  isMyTurn: boolean
  isPlayable: boolean
  isPlayerX: boolean
  onPitClick: (pit: number) => void
}

function Pit({ count, highlighted, clickable, onClick, label }: {
  count: number; highlighted: boolean; clickable: boolean; onClick?: () => void; label: string
}) {
  return (
    <motion.button
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      whileHover={clickable ? { scale: 1.08 } : undefined}
      whileTap={clickable ? { scale: 0.95 } : undefined}
      className={cn(
        'w-14 h-16 md:w-16 md:h-20 rounded-xl flex flex-col items-center justify-center gap-1',
        'border-2 transition-all',
        highlighted ? 'border-brand bg-brand/10' : 'border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800/50',
        clickable && 'cursor-pointer hover:border-brand/50 hover:bg-brand/5',
        !clickable && 'cursor-default opacity-70',
      )}
      aria-label={`${label}: ${count} stones`}
    >
      <span className="text-lg font-bold text-text-primary">{count}</span>
      <span className="text-[10px] text-grey-500">{label}</span>
    </motion.button>
  )
}

function Store({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div className={cn(
      'w-16 md:w-20 h-full min-h-[140px] rounded-2xl flex flex-col items-center justify-center gap-1',
      'border-2 border-grey-300 dark:border-grey-700 bg-grey-100 dark:bg-grey-800/50',
    )}>
      <span className={cn('text-2xl font-bold', color)}>{count}</span>
      <span className="text-[10px] text-grey-500">{label}</span>
    </div>
  )
}

export function MancalaBoard({ pits, lastSowEnd, isMyTurn, isPlayable, isPlayerX, onPitClick }: MancalaBoardProps) {
  const canClick = isMyTurn && isPlayable

  // O's pits displayed right-to-left on top: 12,11,10,9,8,7
  // X's pits displayed left-to-right on bottom: 0,1,2,3,4,5
  const oPits = [12, 11, 10, 9, 8, 7]
  const xPits = [0, 1, 2, 3, 4, 5]

  const canClickPit = (idx: number) => {
    if (!canClick) return false
    if (pits[idx] === 0) return false
    if (isPlayerX) return idx >= 0 && idx <= 5
    return idx >= 7 && idx <= 12
  }

  return (
    <div className="space-y-2">
      <div className="flex items-stretch gap-2 justify-center">
        {/* O's Store (left) */}
        <Store count={pits[13]} label="P2" color="text-player-o" />

        <div className="flex flex-col gap-2 justify-center">
          {/* O's pits (top row, right to left) */}
          <div className="flex gap-1.5">
            {oPits.map(idx => (
              <Pit
                key={idx}
                count={pits[idx]}
                highlighted={lastSowEnd === idx}
                clickable={canClickPit(idx)}
                onClick={() => onPitClick(idx)}
                label={`${idx - 6}`}
              />
            ))}
          </div>

          {/* X's pits (bottom row, left to right) */}
          <div className="flex gap-1.5">
            {xPits.map(idx => (
              <Pit
                key={idx}
                count={pits[idx]}
                highlighted={lastSowEnd === idx}
                clickable={canClickPit(idx)}
                onClick={() => onPitClick(idx)}
                label={`${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* X's Store (right) */}
        <Store count={pits[6]} label="P1" color="text-player-x" />
      </div>

      <p className="text-caption text-grey-500 text-center">
        {isPlayerX ? 'Your pits are on the bottom' : 'Your pits are on the top'}
      </p>
    </div>
  )
}
