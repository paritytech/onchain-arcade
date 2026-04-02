import type {
  GameStatement,
  PlayerSymbol,
  GameStatus,
  GameResult,
  GridSize,
  BoardState,
} from '@/types/game'
import { emptyBoard, checkWinner, isBoardFull } from '@/types/game'
import type { DerivedTicTacToe } from '../statementStore'

export function deriveTicTacToe(gameId: string, stmts: GameStatement[]): DerivedTicTacToe | null {
  const relevant = stmts.filter(s => s.gameId === gameId)
  if (relevant.length === 0) return null

  const create = relevant.find(s => s.type === 'create_game')
  if (!create || create.type !== 'create_game') return null

  const gridSize: GridSize = create.gridSize || 3
  const board: BoardState = emptyBoard(gridSize)
  let playerO: string | null = null
  let playerOName: string | null = null
  let status: GameStatus = 'waiting'
  let result: GameResult = null
  let winningLine: number[] | null = null
  let moveCount = 0
  let updatedAt = create.timestamp

  for (const stmt of relevant) {
    if (stmt.type === 'join_game') {
      playerO = stmt.playerO
      playerOName = stmt.playerOName ?? null
      status = 'playing'
      updatedAt = stmt.timestamp
    } else if (stmt.type === 'make_move') {
      if (status !== 'playing') continue
      if (stmt.cellIndex == null) continue
      if (board[stmt.cellIndex] !== null) continue

      const isX = stmt.player === create.playerX
      const symbol: PlayerSymbol = isX ? 'X' : 'O'
      const expectedTurn: PlayerSymbol = moveCount % 2 === 0 ? 'X' : 'O'
      if (symbol !== expectedTurn) continue

      board[stmt.cellIndex] = symbol
      moveCount++
      updatedAt = stmt.timestamp

      const { winner, line } = checkWinner(board, gridSize)
      if (winner) {
        result = winner === 'X' ? 'x_wins' : 'o_wins'
        winningLine = line
        status = 'finished'
      } else if (isBoardFull(board)) {
        result = 'draw'
        status = 'finished'
      }
    }
  }

  return {
    id: gameId,
    gameType: 'tic-tac-toe',
    gridSize,
    board,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO,
    playerOName,
    currentTurn: moveCount % 2 === 0 ? 'X' : 'O',
    status,
    result,
    winningLine,
    moveCount,
    createdAt: create.timestamp,
    updatedAt,
  }
}
