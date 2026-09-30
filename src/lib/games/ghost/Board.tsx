import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

const GHOST_WORD = 'GHOST'

interface GhostBoardProps {
  fragment: string
  ghostLetters: { X: number; O: number }
  challengeResult: 'challenger_wins' | 'challenger_loses' | null
  currentTurn: 'X' | 'O'
  isMyTurn: boolean
  isPlayable: boolean
  onAddLetter: (letter: string) => void
  onChallenge: () => void
}

export function GhostBoard({
  fragment,
  ghostLetters,
  challengeResult,
  currentTurn,
  isMyTurn,
  isPlayable,
  onAddLetter,
  onChallenge,
}: GhostBoardProps) {
  const canInteract = isMyTurn && isPlayable

  return (
    <div className="space-y-6">
      <p className="text-caption text-text-secondary text-center">
        Add letters to build a fragment. Complete a 4+ letter word and you get a ghost letter.
        Challenge if you think the fragment leads nowhere.
      </p>

      {/* Ghost meters */}
      <div className="flex justify-between gap-4">
        <GhostMeter label="Player X" count={ghostLetters.X} />
        <GhostMeter label="Player O" count={ghostLetters.O} />
      </div>

      {/* Fragment display */}
      <div className="flex justify-center py-6">
        <div className="min-h-[4rem] flex items-center justify-center rounded-xl bg-surface border border-border px-8">
          <AnimatePresence mode="popLayout">
            {fragment.length > 0 ? (
              fragment.split('').map((ch, i) => (
                <motion.span
                  key={`${i}-${ch}`}
                  initial={{ opacity: 0, y: -20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="text-3xl md:text-4xl font-mono font-bold text-brand uppercase tracking-widest"
                >
                  {ch}
                </motion.span>
              ))
            ) : (
              <motion.span
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-xl text-text-secondary italic"
              >
                No letters yet
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Challenge result banner */}
      {challengeResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-center py-2 px-4 rounded-lg text-body-sm font-medium',
            challengeResult === 'challenger_wins'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          )}
        >
          {challengeResult === 'challenger_wins'
            ? 'Challenge successful! Fragment was not a valid prefix.'
            : 'Challenge failed! Fragment is a valid prefix.'}
        </motion.div>
      )}

      {/* Turn indicator */}
      <p className="text-center text-body-sm text-text-secondary">
        {isMyTurn ? 'Your turn' : `Waiting for Player ${currentTurn}`}
      </p>

      {/* Letter keyboard */}
      <div className="space-y-2">
        {QWERTY_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5">
            {row.map((letter) => (
              <motion.button
                key={letter}
                onClick={() => onAddLetter(letter.toLowerCase())}
                disabled={!canInteract}
                whileHover={canInteract ? { scale: 1.1 } : undefined}
                whileTap={canInteract ? { scale: 0.9 } : undefined}
                className={cn(
                  'w-9 h-10 md:w-10 md:h-11 rounded-lg border text-body-sm font-semibold transition-colors',
                  canInteract
                    ? 'bg-surface border-border text-text hover:bg-brand/10 hover:border-brand/40 active:bg-brand/20'
                    : 'bg-surface/50 border-border/50 text-text-secondary/50 cursor-default'
                )}
                aria-label={`Add letter ${letter}`}
              >
                {letter}
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      {/* Challenge button */}
      {canInteract && fragment.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={onChallenge}
            leftIcon={<AlertTriangle className="w-4 h-4" aria-label="Challenge" />}
            className="bg-red-500 hover:bg-red-600 border-red-600"
          >
            Challenge!
          </Button>
        </div>
      )}
    </div>
  )
}

function GhostMeter({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-caption text-text-secondary">{label}</span>
      <div className="flex gap-1">
        {GHOST_WORD.split('').map((ch, i) => (
          <span
            key={i}
            className={cn(
              'w-7 h-7 md:w-8 md:h-8 rounded flex items-center justify-center text-body-sm font-bold',
              i < count
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-surface text-text-secondary/30 border border-border'
            )}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  )
}
