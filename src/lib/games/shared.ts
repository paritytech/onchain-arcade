import type { GameStatement, GameStatus, GameResult, PlayerSymbol, CreateGameStatement } from '@/types/game'

export interface GameStateInit {
  relevant: GameStatement[]
  create: CreateGameStatement
  playerO: string | null
  playerOName: string | null
  status: GameStatus
  result: GameResult
  moveCount: number
  updatedAt: number
  currentTurn: PlayerSymbol
}

/**
 * Shared initialization for all game derivers.
 * Filters relevant statements, finds create, processes join, counts turns.
 * Returns null if no valid create statement found.
 */
export function initGameState(gameId: string, stmts: GameStatement[]): GameStateInit | null {
  const relevant = stmts.filter(s => s.gameId === gameId)
  if (relevant.length === 0) return null

  const create = relevant.find(s => s.type === 'create_game')
  if (!create || create.type !== 'create_game') return null

  let playerO: string | null = null
  let playerOName: string | null = null
  let status: GameStatus = 'waiting'
  let result: GameResult = null
  let moveCount = 0
  let updatedAt = create.timestamp

  // Process join statements (shared across all games)
  for (const stmt of relevant) {
    if (stmt.type === 'join_game') {
      playerO = stmt.playerO
      playerOName = stmt.playerOName ?? null
      status = 'playing'
      updatedAt = stmt.timestamp
    }
  }

  return {
    relevant,
    create,
    playerO,
    playerOName,
    status,
    result,
    moveCount,
    updatedAt,
    currentTurn: 'X',
  }
}
