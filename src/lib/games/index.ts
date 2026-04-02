import type { GameStatement, GameType } from '@/types/game'
import type { DerivedGame } from '../statementStore'
import { deriveTicTacToe } from './tic-tac-toe'
import { deriveConnectFour } from './connect-four'
import { deriveNim } from './nim'

export function deriveGame(gameId: string, stmts: GameStatement[]): DerivedGame | null {
  const relevant = stmts.filter(s => s.gameId === gameId)
  const create = relevant.find(s => s.type === 'create_game')
  if (!create || create.type !== 'create_game') return null

  const gameType: GameType = create.gameType || 'tic-tac-toe'

  switch (gameType) {
    case 'tic-tac-toe':
      return deriveTicTacToe(gameId, stmts)
    case 'connect-four':
      return deriveConnectFour(gameId, stmts)
    case 'nim':
      return deriveNim(gameId, stmts)
    default:
      return null // forward compat: unknown game types are skipped
  }
}
