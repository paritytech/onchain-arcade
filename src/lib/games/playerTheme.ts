/**
 * The two player identities, shared by every board.
 *
 * ## Why these colours
 *
 * Every board used to hardcode its own pair, and the dominant one was
 * `red-500` / `blue-500` — the textbook red/blue confusion under deuteranopia
 * and protanopia, which affect roughly 1 in 12 men. Twelve boards each picking
 * their own red meant twelve places to get it wrong.
 *
 * These are Okabe-Ito: eight colours from the Color Universal Design project,
 * chosen empirically to stay distinguishable under all three common colour
 * vision deficiencies. They work by avoiding the yellow-green confusion range
 * and spanning a wide luminance range, so brightness still separates them even
 * when hue collapses.
 *
 * ## Why there is also a glyph
 *
 * Colour must reinforce information, never carry it alone. A player is a
 * SHAPE first and a colour second — filled disc versus open ring — so the two
 * sides remain distinguishable in greyscale, under any CVD, and for anyone who
 * simply turned the saturation down. Scythe is the canonical board-game example
 * of getting this right.
 *
 * Both values are also exposed as Tailwind tokens (`player-x`, `player-o`) so
 * boards can use them in class names without importing this module.
 */

/** Okabe-Ito blue. Luminance ~0.20 — the darker of the pair. */
export const PLAYER_X_COLOR = '#0072B2'
/** Okabe-Ito vermillion. Luminance ~0.31 — reads lighter, which is the
 *  separating channel once hue is gone. */
export const PLAYER_O_COLOR = '#D55E00'

export type PlayerSide = 'X' | 'O'

export interface PlayerTheme {
  /** Hex, for SVG fill/stroke and inline styles. */
  color: string
  /** Tailwind token name — use as `bg-player-x`, `text-player-x`, … */
  token: 'player-x' | 'player-o'
  /** The shape that carries the identity when colour cannot. */
  shape: 'disc' | 'ring'
  /** Short label for screen readers and move announcements. */
  label: string
}

export const PLAYER_THEME: Record<PlayerSide, PlayerTheme> = {
  X: { color: PLAYER_X_COLOR, token: 'player-x', shape: 'disc', label: 'Player X' },
  O: { color: PLAYER_O_COLOR, token: 'player-o', shape: 'ring', label: 'Player O' },
}

export function themeFor(side: PlayerSide): PlayerTheme {
  return PLAYER_THEME[side]
}


/**
 * The full Okabe-Ito set, for games whose pieces are a PALETTE rather than two
 * sides (Entropy places five colours on one board).
 *
 * Black is omitted: these sit on a dark surface. The five chosen span the
 * widest luminance range of the set, which is what keeps them separable once
 * hue collapses — the previous palette used red/green/blue/yellow/purple, and
 * red-vs-green is the single most common confusion there is.
 */
export const OKABE_ITO = {
  orange: '#E69F00',
  skyBlue: '#56B4E9',
  bluishGreen: '#009E73',
  yellow: '#F0E442',
  blue: '#0072B2',
  vermillion: '#D55E00',
  reddishPurple: '#CC79A7',
} as const
