import type {
  GameStatement,
  PlayerSymbol,
  GameStatus,
  GameResult,
} from '@/types/game'
import type { DerivedNim } from '../statementStore'

const DEFAULT_HEAPS = [3, 4, 5]

export function deriveNim(gameId: string, stmts: GameStatement[]): DerivedNim | null {
  const relevant = stmts.filter(s => s.gameId === gameId)
  if (relevant.length === 0) return null

  const create = relevant.find(s => s.type === 'create_game')
  if (!create || create.type !== 'create_game') return null

  const heaps = [...(create.nimConfig || DEFAULT_HEAPS)]
  let playerO: string | null = null
  let playerOName: string | null = null
  let status: GameStatus = 'waiting'
  let result: GameResult = null
  let moveCount = 0
  let updatedAt = create.timestamp
  let lastMove: { heap: number; count: number } | null = null

  for (const stmt of relevant) {
    if (stmt.type === 'join_game') {
      playerO = stmt.playerO
      playerOName = stmt.playerOName ?? null
      status = 'playing'
      updatedAt = stmt.timestamp
    } else if (stmt.type === 'make_move') {
      if (status !== 'playing') continue
      if (!stmt.nimMove) continue

      const { heap, count } = stmt.nimMove
      if (heap < 0 || heap >= heaps.length) continue
      if (count < 1 || count > heaps[heap]) continue

      const isX = stmt.player === create.playerX
      const symbol: PlayerSymbol = isX ? 'X' : 'O'
      const expectedTurn: PlayerSymbol = moveCount % 2 === 0 ? 'X' : 'O'
      if (symbol !== expectedTurn) continue

      heaps[heap] -= count
      moveCount++
      updatedAt = stmt.timestamp
      lastMove = { heap, count }

      // Misere Nim: the player who takes the last object loses
      if (heaps.every(h => h === 0)) {
        // Current player took the last object — they lose
        result = isX ? 'o_wins' : 'x_wins'
        status = 'finished'
      }
    }
  }

  return {
    id: gameId,
    gameType: 'nim',
    heaps,
    lastMove,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO,
    playerOName,
    currentTurn: moveCount % 2 === 0 ? 'X' : 'O',
    status,
    result,
    moveCount,
    createdAt: create.timestamp,
    updatedAt,
  }
}
