/**
 * The game catalogue: one entry per game, replacing twelve hand-written JSX
 * blocks in HomePage.
 *
 * Structure follows the research on multi-game lobbies. Twelve games in one
 * flat grid reads as a dump; the same twelve under labelled rows read as a
 * selection someone made. `shelf` is that curation, and it is a judgement call
 * about how long a game takes to *understand*, not how hard it is to win.
 *
 * Cards carry identity and nothing else — art, name, one line. Everything
 * configurable moved to the setup sheet, which is what makes the grid scannable
 * and gives "how to play" somewhere to live. Jackbox and Poki both land here
 * from opposite directions: consistent structure, differentiated surface.
 *
 * Tailwind class strings are written out in full rather than composed from the
 * accent name. `border-${accent}-500/20` is invisible to Tailwind's static
 * scanner and would be silently dropped from the build.
 */

import {
  Box, Castle, CircleDot, Disc, Gem, Grid3X3, Layers, Puzzle,
  Scissors, Shuffle, Smile, Type, type LucideIcon,
} from 'lucide-react'

import type { GameType } from '@/types/game'

export type Shelf = 'quick' | 'deeper'

export interface GameEntry {
  id: GameType
  name: string
  /** One line, on the card. What the game feels like, not its rules. */
  tagline: string
  icon: LucideIcon
  /** "2" or a range. Shown on the card: it is the thing that decides whether
   *  you can play right now, so it does not belong two clicks deep. */
  players: string
  shelf: Shelf
  /** Static Tailwind classes — see the note above on why these are literal. */
  cardClass: string
  iconWrapClass: string
  iconClass: string
  /** Chosen accent for the setup sheet's primary action, so the game's colour
   *  REPLACES the shell accent on that surface rather than competing with it. */
  actionClass: string
}

export const CATALOG: GameEntry[] = [
  {
    id: 'tic-tac-toe', name: 'Tic-Tac-Toe', tagline: 'Classic grid strategy',
    icon: Grid3X3, players: '2', shelf: 'quick',
    cardClass: 'border-pink-500/20 hover:border-pink-500/40 bg-gradient-to-b from-pink-100/80 to-grey-100/90 dark:from-pink-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-pink-500/15', iconClass: 'text-pink-500 dark:text-pink-400',
    actionClass: 'bg-pink-500 hover:bg-pink-600 text-white',
  },
  {
    id: 'connect-four', name: 'Connect Four', tagline: 'Drop discs, get four in a row',
    icon: Layers, players: '2', shelf: 'quick',
    cardClass: 'border-blue-500/20 hover:border-blue-500/40 bg-gradient-to-b from-blue-100/80 to-grey-100/90 dark:from-blue-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-blue-500/15', iconClass: 'text-blue-500 dark:text-blue-400',
    actionClass: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  {
    id: 'nim', name: 'Nim', tagline: 'Take tokens, avoid the last',
    icon: CircleDot, players: '2', shelf: 'quick',
    cardClass: 'border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-b from-amber-100/80 to-grey-100/90 dark:from-amber-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-amber-500/15', iconClass: 'text-amber-600 dark:text-amber-400',
    actionClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  {
    id: 'dots-and-boxes', name: 'Dots & Boxes', tagline: 'Draw lines, claim boxes',
    icon: Box, players: '2', shelf: 'quick',
    cardClass: 'border-emerald-500/20 hover:border-emerald-500/40 bg-gradient-to-b from-emerald-100/80 to-grey-100/90 dark:from-emerald-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-emerald-500/15', iconClass: 'text-emerald-600 dark:text-emerald-400',
    actionClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
  {
    id: 'ghost', name: 'Ghost', tagline: "Word game — don't finish the word",
    icon: Type, players: '2', shelf: 'quick',
    cardClass: 'border-rose-500/20 hover:border-rose-500/40 bg-gradient-to-b from-rose-100/80 to-grey-100/90 dark:from-rose-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-rose-500/15', iconClass: 'text-rose-500 dark:text-rose-400',
    actionClass: 'bg-rose-500 hover:bg-rose-600 text-white',
  },
  {
    id: 'emoji-pictionary', name: 'Emoji Pictionary', tagline: 'Describe the word with emoji',
    icon: Smile, players: '3–8', shelf: 'quick',
    cardClass: 'border-yellow-500/20 hover:border-yellow-500/40 bg-gradient-to-b from-yellow-100/80 to-grey-100/90 dark:from-yellow-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-yellow-500/15', iconClass: 'text-yellow-600 dark:text-yellow-400',
    actionClass: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  },
  {
    id: 'mancala', name: 'Mancala', tagline: 'Sow stones, capture to win',
    icon: Gem, players: '2', shelf: 'deeper',
    cardClass: 'border-violet-500/20 hover:border-violet-500/40 bg-gradient-to-b from-violet-100/80 to-grey-100/90 dark:from-violet-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-violet-500/15', iconClass: 'text-violet-500 dark:text-violet-400',
    actionClass: 'bg-violet-500 hover:bg-violet-600 text-white',
  },
  {
    id: 'reversi', name: 'Reversi', tagline: 'Flip discs, control the board',
    icon: Disc, players: '2', shelf: 'deeper',
    cardClass: 'border-teal-500/20 hover:border-teal-500/40 bg-gradient-to-b from-teal-100/80 to-grey-100/90 dark:from-teal-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-teal-500/15', iconClass: 'text-teal-600 dark:text-teal-400',
    actionClass: 'bg-teal-500 hover:bg-teal-600 text-white',
  },
  {
    id: 'hackenbush', name: 'Hackenbush', tagline: 'Cut edges, collapse the graph',
    icon: Scissors, players: '2', shelf: 'deeper',
    cardClass: 'border-red-500/20 hover:border-red-500/40 bg-gradient-to-b from-red-100/80 to-grey-100/90 dark:from-red-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-red-500/15', iconClass: 'text-red-500 dark:text-red-400',
    actionClass: 'bg-red-500 hover:bg-red-600 text-white',
  },
  {
    id: 'entropy', name: 'Entropy', tagline: 'Chaos against Order',
    icon: Shuffle, players: '2', shelf: 'deeper',
    cardClass: 'border-sky-500/20 hover:border-sky-500/40 bg-gradient-to-b from-sky-100/80 to-grey-100/90 dark:from-sky-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-sky-500/15', iconClass: 'text-sky-500 dark:text-sky-400',
    actionClass: 'bg-sky-500 hover:bg-sky-600 text-white',
  },
  {
    id: 'blokus-duo', name: 'Blokus Duo', tagline: 'Polyomino spatial puzzle',
    icon: Puzzle, players: '2', shelf: 'deeper',
    cardClass: 'border-fuchsia-500/20 hover:border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-100/80 to-grey-100/90 dark:from-fuchsia-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-fuchsia-500/15', iconClass: 'text-fuchsia-500 dark:text-fuchsia-400',
    actionClass: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white',
  },
  {
    id: 'tak', name: 'Tak', tagline: 'Stack pieces, build roads',
    icon: Castle, players: '2', shelf: 'deeper',
    cardClass: 'border-orange-500/20 hover:border-orange-500/40 bg-gradient-to-b from-orange-100/80 to-grey-100/90 dark:from-orange-950/40 dark:to-grey-900/80',
    iconWrapClass: 'bg-orange-500/15', iconClass: 'text-orange-600 dark:text-orange-400',
    actionClass: 'bg-orange-500 hover:bg-orange-600 text-white',
  },
]

export const SHELF_LABEL: Record<Shelf, string> = {
  quick: 'Learn in a minute',
  deeper: 'Worth a few games',
}

export function entriesOn(shelf: Shelf): GameEntry[] {
  return CATALOG.filter((g) => g.shelf === shelf)
}

export function entryFor(id: GameType): GameEntry | undefined {
  return CATALOG.find((g) => g.id === id)
}
