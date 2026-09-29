// Everything configurable about a game, moved off the card.
//
// The card used to carry its own variant selector, which made the grid ragged
// (cards with selectors were taller than cards without) and left nowhere for
// "how to play" — the one thing a catalogue of twelve unfamiliar games most
// needs. Both live here now, opened by picking a game.
//
// The game's accent REPLACES the shell accent on this surface rather than
// sitting beside it: two competing accents mean neither is primary.
import { useState } from 'react'
import { Users } from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/cn'
import { GAME_RULES } from '@/lib/game-rules'
import type { GameEntry } from '@/lib/games/catalog'
import type { GridSize } from '@/types/game'
import { WIN_LENGTH } from '@/types/game'

const GRID_OPTIONS: { size: GridSize; label: string }[] = [
  { size: 3, label: '3×3' },
  { size: 5, label: '5×5' },
  { size: 7, label: '7×7' },
]

const NIM_PRESETS: { label: string; heaps: number[] }[] = [
  { label: 'Quick', heaps: [1, 2, 3] },
  { label: 'Classic', heaps: [3, 4, 5] },
  { label: 'Big', heaps: [5, 6, 7] },
]

export interface SetupChoice {
  gridSize?: GridSize
  nimConfig?: number[]
  maxPlayers?: number
  vsComputer: boolean
}

interface Props {
  entry: GameEntry | null
  busy: boolean
  onClose: () => void
  onStart: (choice: SetupChoice) => void
}

export function GameSetupSheet({ entry, busy, onClose, onStart }: Props) {
  const [grid, setGrid] = useState<GridSize>(3)
  const [nim, setNim] = useState(1)
  const [players, setPlayers] = useState(3)

  if (!entry) return null

  const rules = GAME_RULES[entry.id]
  const choice = (vsComputer: boolean): SetupChoice => ({
    vsComputer,
    gridSize: entry.id === 'tic-tac-toe' ? grid : undefined,
    nimConfig: entry.id === 'nim' ? NIM_PRESETS[nim].heaps : undefined,
    maxPlayers: entry.id === 'emoji-pictionary' ? players : undefined,
  })

  const chip = (active: boolean) =>
    cn(
      'flex-1 py-2.5 rounded-lg text-body-sm font-semibold transition-colors min-h-[44px]',
      active
        ? entry.actionClass
        : 'bg-black/5 dark:bg-white/5 text-text-secondary hover:bg-black/10 dark:hover:bg-white/10',
    )

  return (
    <Modal isOpen={!!entry} onClose={onClose} title={entry.name}>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', entry.iconWrapClass)}>
            <entry.icon className={cn('w-5 h-5', entry.iconClass)} aria-hidden="true" />
          </div>
          <div>
            <p className="text-body-sm text-text-primary">{entry.tagline}</p>
            <p className="flex items-center gap-1.5 text-caption text-text-secondary mt-1">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              {entry.players} players
            </p>
          </div>
        </div>

        {rules && (
          <div>
            <h4 className="text-body-sm font-semibold text-text-primary mb-1">How to play</h4>
            <p className="text-caption text-text-secondary leading-relaxed">{rules.description}</p>
            <ul className="mt-2 space-y-1">
              {rules.rules.slice(0, 3).map((r) => (
                <li key={r} className="text-caption text-text-secondary leading-relaxed pl-3 relative">
                  <span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-text-tertiary" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {entry.id === 'tic-tac-toe' && (
          <div>
            <h4 className="text-body-sm font-semibold text-text-primary mb-2">Board size</h4>
            <div className="flex gap-2">
              {GRID_OPTIONS.map((o) => (
                <button key={o.size} onClick={() => setGrid(o.size)} className={chip(grid === o.size)}>
                  {o.label}
                </button>
              ))}
            </div>
            <p className="text-caption text-text-secondary mt-2 h-4">
              {grid > 3 ? `${WIN_LENGTH[grid]} in a row to win` : 'Three in a row to win'}
            </p>
          </div>
        )}

        {entry.id === 'nim' && (
          <div>
            <h4 className="text-body-sm font-semibold text-text-primary mb-2">Heaps</h4>
            <div className="flex gap-2">
              {NIM_PRESETS.map((p, i) => (
                <button key={p.label} onClick={() => setNim(i)} className={chip(nim === i)}>
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-caption text-text-secondary mt-2 h-4">
              Heaps: [{NIM_PRESETS[nim].heaps.join(', ')}]
            </p>
          </div>
        )}

        {entry.id === 'emoji-pictionary' && (
          <div>
            <h4 className="text-body-sm font-semibold text-text-primary mb-2">Players</h4>
            <div className="flex gap-2">
              {[3, 4, 5, 6, 7, 8].map((n) => (
                <button key={n} onClick={() => setPlayers(n)} className={chip(players === n)}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={() => onStart(choice(false))}
            disabled={busy}
            className={cn(
              'flex-1 py-3 rounded-xl font-semibold text-body-sm transition-colors min-h-[48px] disabled:opacity-40',
              entry.actionClass,
            )}
          >
            {entry.id === 'emoji-pictionary' ? 'Create lobby' : 'Play a friend'}
          </button>
          {entry.id !== 'emoji-pictionary' && (
            <button
              onClick={() => onStart(choice(true))}
              disabled={busy}
              className="flex-1 py-3 rounded-xl font-semibold text-body-sm min-h-[48px] border border-border text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              Play the computer
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
