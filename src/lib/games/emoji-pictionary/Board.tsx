import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Send, SkipForward, Trophy, Crown } from 'lucide-react'
import type { EmojiPlayer, EmojiGuess } from '@/types/derived-game'

interface EmojiPictionaryBoardProps {
  players: EmojiPlayer[]
  currentDescriber: number
  currentWord: string
  clues: string[]
  guesses: EmojiGuess[]
  roundNumber: number
  totalRounds: number
  wordGuessed: boolean
  myPlayerIndex: number | null
  isPlayable: boolean
  onSendClue: (clue: string) => void
  onGuess: (guess: string) => void
  onSkip: () => void
}

export function EmojiPictionaryBoard({
  players, currentDescriber, currentWord, clues, guesses,
  roundNumber, totalRounds, myPlayerIndex, isPlayable,
  onSendClue, onGuess, onSkip,
}: EmojiPictionaryBoardProps) {
  const [input, setInput] = useState('')
  const isDescriber = myPlayerIndex === currentDescriber
  const canAct = isPlayable && myPlayerIndex !== null

  const handleSubmit = () => {
    if (!input.trim()) return
    if (isDescriber) {
      onSendClue(input.trim())
    } else {
      onGuess(input.trim())
    }
    setInput('')
  }

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto">
      {/* Round indicator */}
      <div className="text-center">
        <p className="text-caption text-grey-500">
          Round {roundNumber + 1} of {totalRounds}
        </p>
        <p className="text-body-sm text-text-secondary">
          {players[currentDescriber]?.name || 'Player ' + (currentDescriber + 1)} is describing
        </p>
      </div>

      {/* Scoreboard */}
      <div className="flex flex-wrap justify-center gap-2">
        {players.map((p, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption',
              i === currentDescriber ? 'bg-brand/10 border border-brand/30 text-brand' : 'bg-grey-800/30 border border-grey-700 text-grey-400',
              i === myPlayerIndex && 'ring-1 ring-white/20',
            )}
          >
            {i === currentDescriber && <Crown className="w-3 h-3" />}
            <span className="font-medium">{p.name || `P${i + 1}`}</span>
            <span className="text-grey-500">{p.score}pts</span>
          </div>
        ))}
      </div>

      {/* Word (only shown to describer) */}
      {isDescriber && canAct && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 rounded-xl bg-brand/10 border border-brand/20"
        >
          <p className="text-caption text-brand mb-1">Your word to describe:</p>
          <p className="text-h3 font-bold text-text-primary">{currentWord}</p>
          <p className="text-caption text-grey-500 mt-1">Use only emoji — no letters!</p>
        </motion.div>
      )}

      {/* Clues display */}
      <div className="min-h-[80px] p-4 rounded-xl bg-grey-800/30 border border-grey-700">
        {clues.length === 0 ? (
          <p className="text-center text-grey-500 text-body-sm">
            {isDescriber ? 'Send emoji clues below...' : 'Waiting for clues...'}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
              {clues.map((clue, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-3xl"
                >
                  {clue}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Guesses log */}
      {guesses.length > 0 && (
        <div className="space-y-1">
          {guesses.map((g, i) => (
            <div key={i} className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-lg text-body-sm',
              g.correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-grey-800/20 text-grey-500',
            )}>
              <span className="font-medium">{players[g.playerIndex]?.name || `P${g.playerIndex + 1}`}:</span>
              <span>{g.text}</span>
              {g.correct && <Trophy className="w-3.5 h-3.5 ml-auto" />}
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      {canAct && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={isDescriber ? 'Type emoji clues...' : 'Type your guess...'}
            className="flex-1 px-4 py-2.5 rounded-xl bg-grey-800/50 border border-grey-700 text-text-primary placeholder:text-grey-500 focus:outline-none focus:border-brand/50 text-body-sm"
          />
          <Button variant="primary" size="md" onClick={handleSubmit} leftIcon={<Send className="w-4 h-4" />}>
            {isDescriber ? 'Send' : 'Guess'}
          </Button>
          {isDescriber && (
            <Button variant="ghost" size="md" onClick={onSkip} leftIcon={<SkipForward className="w-4 h-4" />}>
              Skip
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
