import type { GameStatement, GameType } from '@/types/game'
import type { DerivedGame } from '@/types/derived-game'
import { deriveTicTacToe } from './tic-tac-toe'
import { deriveConnectFour } from './connect-four'
import { deriveNim } from './nim-game'
import { deriveDotsAndBoxes } from './dots-and-boxes'
import { deriveMancala } from './mancala'
import { deriveReversi } from './reversi'

type DeriverFn = (gameId: string, stmts: GameStatement[]) => DerivedGame | null

const derivers: Partial<Record<GameType, DeriverFn>> = {
  'tic-tac-toe': deriveTicTacToe,
  'connect-four': deriveConnectFour,
  'nim': deriveNim,
  'dots-and-boxes': deriveDotsAndBoxes,
  'mancala': deriveMancala,
  'reversi': deriveReversi,
}

export function deriveGame(gameId: string, stmts: GameStatement[]): DerivedGame | null {
  const relevant = stmts.filter(s => s.gameId === gameId)
  const create = relevant.find(s => s.type === 'create_game')
  if (!create || create.type !== 'create_game') return null

  const gameType: GameType = create.gameType || 'tic-tac-toe'
  const deriver = derivers[gameType]
  return deriver ? deriver(gameId, stmts) : null
}
