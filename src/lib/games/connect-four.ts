import type {
  GameStatement,
  PlayerSymbol,
  GameStatus,
  GameResult,
  BoardState,
} from '@/types/game'
import type { DerivedConnectFour } from '../statementStore'

export const C4_ROWS = 6
export const C4_COLS = 7
const C4_WIN_LEN = 4

export function emptyC4Board(): BoardState {
  return Array(C4_ROWS * C4_COLS).fill(null)
}

/** Drop a disc into a column. Returns the landing cell index, or -1 if column is full. */
export function dropDisc(board: BoardState, col: number, symbol: PlayerSymbol): number {
  for (let row = C4_ROWS - 1; row >= 0; row--) {
    const idx = row * C4_COLS + col
    if (board[idx] === null) {
      board[idx] = symbol
      return idx
    }
  }
  return -1
}

/** Check for 4 in a row. */
function checkWinnerC4(board: BoardState): { winner: PlayerSymbol | null; line: number[] | null } {
  // Horizontal
  for (let row = 0; row < C4_ROWS; row++) {
    for (let col = 0; col <= C4_COLS - C4_WIN_LEN; col++) {
      const idx = row * C4_COLS + col
      const line = [idx, idx + 1, idx + 2, idx + 3]
      const first = board[line[0]]
      if (first && line.every(i => board[i] === first)) {
        return { winner: first as PlayerSymbol, line }
      }
    }
  }
  // Vertical
  for (let col = 0; col < C4_COLS; col++) {
    for (let row = 0; row <= C4_ROWS - C4_WIN_LEN; row++) {
      const idx = row * C4_COLS + col
      const line = [idx, idx + C4_COLS, idx + 2 * C4_COLS, idx + 3 * C4_COLS]
      const first = board[line[0]]
      if (first && line.every(i => board[i] === first)) {
        return { winner: first as PlayerSymbol, line }
      }
    }
  }
  // Diagonal ↘
  for (let row = 0; row <= C4_ROWS - C4_WIN_LEN; row++) {
    for (let col = 0; col <= C4_COLS - C4_WIN_LEN; col++) {
      const idx = row * C4_COLS + col
      const line = [idx, idx + C4_COLS + 1, idx + 2 * (C4_COLS + 1), idx + 3 * (C4_COLS + 1)]
      const first = board[line[0]]
      if (first && line.every(i => board[i] === first)) {
        return { winner: first as PlayerSymbol, line }
      }
    }
  }
  // Diagonal ↙
  for (let row = 0; row <= C4_ROWS - C4_WIN_LEN; row++) {
    for (let col = C4_WIN_LEN - 1; col < C4_COLS; col++) {
      const idx = row * C4_COLS + col
      const line = [idx, idx + C4_COLS - 1, idx + 2 * (C4_COLS - 1), idx + 3 * (C4_COLS - 1)]
      const first = board[line[0]]
      if (first && line.every(i => board[i] === first)) {
        return { winner: first as PlayerSymbol, line }
      }
    }
  }
  return { winner: null, line: null }
}

export function deriveConnectFour(gameId: string, stmts: GameStatement[]): DerivedConnectFour | null {
  const relevant = stmts.filter(s => s.gameId === gameId)
  if (relevant.length === 0) return null

  const create = relevant.find(s => s.type === 'create_game')
  if (!create || create.type !== 'create_game') return null

  const board = emptyC4Board()
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
      if (stmt.column == null || stmt.column < 0 || stmt.column >= C4_COLS) continue

      const isX = stmt.player === create.playerX
      const symbol: PlayerSymbol = isX ? 'X' : 'O'
      const expectedTurn: PlayerSymbol = moveCount % 2 === 0 ? 'X' : 'O'
      if (symbol !== expectedTurn) continue

      const landingIdx = dropDisc(board, stmt.column, symbol)
      if (landingIdx === -1) continue // column full — reject

      moveCount++
      updatedAt = stmt.timestamp

      const { winner, line } = checkWinnerC4(board)
      if (winner) {
        result = winner === 'X' ? 'x_wins' : 'o_wins'
        winningLine = line
        status = 'finished'
      } else if (board.every(c => c !== null)) {
        result = 'draw'
        status = 'finished'
      }
    }
  }

  return {
    id: gameId,
    gameType: 'connect-four',
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
