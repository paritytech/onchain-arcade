import type { GameStatement, PlayerSymbol, GridSize, BoardState } from '@/types/game'
import { emptyBoard, checkWinner, isBoardFull } from '@/types/game'
import type { DerivedTicTacToe } from '@/types/derived-game'
import { initGameState } from '../shared'

export function deriveTicTacToe(gameId: string, stmts: GameStatement[]): DerivedTicTacToe | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const gridSize: GridSize = create.gridSize || 3
  const board: BoardState = emptyBoard(gridSize)
  let winningLine: number[] | null = null

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue
    if (stmt.cellIndex == null) continue
    if (board[stmt.cellIndex] !== null) continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== (moveCount % 2 === 0 ? 'X' : 'O')) continue

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

  return {
    id: gameId,
    gameType: 'tic-tac-toe',
    gridSize,
    board,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: init.playerO,
    playerOName: init.playerOName,
    currentTurn: moveCount % 2 === 0 ? 'X' : 'O',
    status,
    result,
    winningLine,
    moveCount,
    vsComputer: create.vsComputer ?? false,
    createdAt: create.timestamp,
    updatedAt,
  }
}
