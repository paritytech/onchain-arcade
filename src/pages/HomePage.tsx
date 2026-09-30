// The lobby.
//
// Was one flat grid of twelve hand-written cards, each carrying its own variant
// selector. Twelve games in a flat grid reads as a dump rather than a
// selection, and the on-card selectors made the grid ragged (cards with one
// were taller) while leaving nowhere for "how to play" — the thing a catalogue
// of unfamiliar games most needs.
//
// Now: labelled shelves, uniform identity-only cards, and everything
// configurable behind a setup sheet. Data lives in lib/games/catalog.ts.
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Copy, Info, Users } from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { GameSetupSheet, type SetupChoice } from '@/components/GameSetupSheet'
import { JoinByCode } from '@/components/JoinByCode'
import { staggerContainer, staggerItem } from '@/lib/animation-variants'
import { usePolkadotWallet } from '@/contexts/WalletContext'
import { useGame } from '@/contexts/GameContext'
import { useNotifications } from '@/contexts/NotificationProvider'
import { GAME_RULES } from '@/lib/game-rules'
import { cn } from '@/lib/cn'
import { CATALOG, SHELF_LABEL, entriesOn, entryFor, type GameEntry, type Shelf } from '@/lib/games/catalog'
import type { GameType } from '@/types/game'

function GameCard({ entry, onPick, onRules }: {
  entry: GameEntry
  onPick: (e: GameEntry) => void
  onRules: (g: GameType) => void
}) {
  return (
    <motion.button
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onPick(entry)}
      className={cn(
        'group relative text-left w-full rounded-2xl border p-5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        entry.cardClass,
      )}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', entry.iconWrapClass)}>
        <entry.icon className={cn('w-5 h-5', entry.iconClass)} aria-hidden="true" />
      </div>

      <h3 className="text-base font-bold text-text-primary tracking-tight">{entry.name}</h3>
      <p className="text-caption text-text-secondary mt-0.5 leading-snug">{entry.tagline}</p>

      <p className="flex items-center gap-1.5 text-caption text-text-tertiary mt-3">
        <Users className="w-3.5 h-3.5" aria-hidden="true" />
        {entry.players}
      </p>

      {/* Rules are reachable without committing to the setup sheet. Nested
          inside a button would be invalid markup, so it is a sibling overlay. */}
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onRules(entry.id) }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onRules(entry.id) }
        }}
        className="absolute top-4 right-4 p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label={`How to play ${entry.name}`}
      >
        <Info className="w-4 h-4" />
      </span>
    </motion.button>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  const { address } = usePolkadotWallet()
  const { createGame, isLoading, games } = useGame()
  const { addNotification } = useNotifications()

  const [setupFor, setSetupFor] = useState<GameEntry | null>(null)
  const [rulesGame, setRulesGame] = useState<GameType | null>(null)
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [createdGameType, setCreatedGameType] = useState<GameType>('tic-tac-toe')
  const [copied, setCopied] = useState(false)

  /** Games this player is in that have not finished. The research calls a
   *  "Continue" row the single highest-value thing in a lobby, and it is the
   *  only row whose contents change. */
  const inProgress = useMemo(
    () => (address ? games.filter(
      (g) => g.status !== 'finished' && (g.playerX === address || g.playerO === address),
    ).slice(0, 6) : []),
    [games, address],
  )

  const handleStart = async (choice: SetupChoice) => {
    const entry = setupFor
    if (!entry) return
    const gameId = await createGame(entry.id, {
      gridSize: choice.gridSize,
      nimConfig: choice.nimConfig,
      maxPlayers: choice.maxPlayers,
      vsComputer: choice.vsComputer,
    })
    setSetupFor(null)
    if (!gameId) return
    if (choice.vsComputer) {
      navigate(`/play?game=${gameId}`)
      return
    }
    setCreatedCode(gameId)
    setCreatedGameType(entry.id)
  }

  const shareUrl = createdCode
    ? `${window.location.origin}${window.location.pathname}#/play?game=${createdCode}&host=${address}&type=${createdGameType}`
    : ''

  const handleCopy = async () => {
    if (!createdCode) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addNotification('info', `Game code: ${createdCode}`)
    }
  }

  const shelf = (id: Shelf) => (
    <motion.section variants={staggerItem} key={id} aria-labelledby={`shelf-${id}`}>
      <h2 id={`shelf-${id}`} className="font-sans text-body-sm font-semibold text-text-secondary mb-3">
        {SHELF_LABEL[id]}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entriesOn(id).map((e) => (
          <GameCard key={e.id} entry={e} onPick={setSetupFor} onRules={setRulesGame} />
        ))}
      </div>
    </motion.section>
  )

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-10 pt-4">
      <motion.div variants={staggerItem} className="text-center">
        <h1 className="font-serif text-h1 text-text-primary mb-1">onchain arcade</h1>
        <p className="text-body-sm text-text-secondary">Pick a game, share the code, play in real time</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <JoinByCode />
      </motion.div>

      {/* The waiting state. Previously a code and two buttons; the opponent's
          absence was dead time with nothing to do in it. Playing the computer
          already existed — it was just in the wrong place. */}
      {createdCode && (
        <motion.div variants={staggerItem} className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-body-sm text-text-secondary">Share this with your opponent</p>
          <p className="font-mono text-h3 text-brand tracking-[0.2em] my-2">{createdCode}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl border border-border text-body-sm text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[44px] flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <button
              onClick={() => navigate(`/play?game=${createdCode}`)}
              className="px-4 py-2.5 rounded-xl bg-accent text-white text-body-sm font-medium min-h-[44px] flex items-center gap-2"
            >
              Open the game
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-caption text-text-tertiary mt-3">
            Waiting for them to join. The link works until the game ends.
          </p>
        </motion.div>
      )}

      {inProgress.length > 0 && (
        <motion.section variants={staggerItem} aria-labelledby="shelf-continue">
          <h2 id="shelf-continue" className="font-sans text-body-sm font-semibold text-text-secondary mb-3">
            Continue
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((g) => {
              const entry = entryFor(g.gameType ?? 'tic-tac-toe')
              const yours = g.currentTurn && (
                (g.currentTurn === 'X' && g.playerX === address) ||
                (g.currentTurn === 'O' && g.playerO === address)
              )
              return (
                <button
                  key={g.id}
                  onClick={() => navigate(`/play?game=${g.id}`)}
                  className="text-left rounded-xl border border-border bg-surface p-4 hover:border-border-strong transition-colors min-h-[44px]"
                >
                  <p className="text-body-sm font-semibold text-text-primary">{entry?.name ?? g.gameType}</p>
                  <p className="font-mono text-caption text-text-tertiary">{g.id}</p>
                  <p className={cn('text-caption mt-1', yours ? 'text-success font-medium' : 'text-text-secondary')}>
                    {g.status === 'waiting' ? 'Waiting for an opponent' : yours ? 'Your turn' : 'Their turn'}
                  </p>
                </button>
              )
            })}
          </div>
        </motion.section>
      )}

      {shelf('quick')}
      {shelf('deeper')}

      <GameSetupSheet
        entry={setupFor}
        busy={isLoading}
        onClose={() => setSetupFor(null)}
        onStart={handleStart}
      />

      <Modal
        isOpen={rulesGame !== null}
        onClose={() => setRulesGame(null)}
        title={rulesGame ? GAME_RULES[rulesGame].title : ''}
      >
        {rulesGame && (
          <div className="space-y-3">
            <p className="text-body-sm text-text-secondary">{GAME_RULES[rulesGame].description}</p>
            <ul className="space-y-2">
              {GAME_RULES[rulesGame].rules.map((rule, i) => (
                <li key={i} className="flex gap-2 text-body-sm text-text-primary">
                  <span className="text-brand font-bold shrink-0">{i + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {CATALOG.length === 0 && (
        <p className="text-center text-text-secondary">No games available.</p>
      )}
    </motion.div>
  )
}
