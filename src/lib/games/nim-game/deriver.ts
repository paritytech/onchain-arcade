import type { GameStatement, PlayerSymbol } from '@/types/game'
import type { DerivedNim } from '@/types/derived-game'
import { initGameState } from '../shared'

const DEFAULT_HEAPS = [3, 4, 5]

export function deriveNim(gameId: string, stmts: GameStatement[]): DerivedNim | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const heaps = [...(create.nimConfig || DEFAULT_HEAPS)]
  let lastMove: { heap: number; count: number } | null = null

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue
    if (!stmt.nimMove) continue

    const { heap, count } = stmt.nimMove
    if (heap < 0 || heap >= heaps.length) continue
    if (count < 1 || count > heaps[heap]) continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== (moveCount % 2 === 0 ? 'X' : 'O')) continue

    heaps[heap] -= count
    moveCount++
    updatedAt = stmt.timestamp
    lastMove = { heap, count }

    // Misere Nim: the player who takes the last object loses
    if (heaps.every(h => h === 0)) {
      result = isX ? 'o_wins' : 'x_wins'
      status = 'finished'
    }
  }

  return {
    id: gameId,
    gameType: 'nim',
    heaps,
    lastMove,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: init.playerO,
    playerOName: init.playerOName,
    currentTurn: moveCount % 2 === 0 ? 'X' : 'O',
    status,
    result,
    moveCount,
    createdAt: create.timestamp,
    updatedAt,
  }
}
