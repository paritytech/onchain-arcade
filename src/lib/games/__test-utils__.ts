import type { GameStatement } from '@/types/game'

export const ts = () => Date.now()

export function makeStmts(gameId: string, ...actions: GameStatement[]): GameStatement[] {
  return actions.map(a => ({ ...a, gameId }))
}
