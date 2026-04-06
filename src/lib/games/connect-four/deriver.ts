import type { GameStatement, PlayerSymbol, BoardState } from '@/types/game'
import type { DerivedConnectFour } from '@/types/derived-game'
import { initGameState } from '../shared'

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

function checkWinnerC4(board: BoardState): { winner: PlayerSymbol | null; line: number[] | null } {
  const check = (indices: number[]) => {
    const first = board[indices[0]]
    return first && indices.every(i => board[i] === first)
      ? { winner: first as PlayerSymbol, line: indices }
      : null
  }

  for (let row = 0; row < C4_ROWS; row++) {
    for (let col = 0; col < C4_COLS; col++) {
      const idx = row * C4_COLS + col
      // Horizontal
      if (col <= C4_COLS - C4_WIN_LEN) {
        const r = check([idx, idx + 1, idx + 2, idx + 3])
        if (r) return r
      }
      // Vertical
      if (row <= C4_ROWS - C4_WIN_LEN) {
        const r = check([idx, idx + C4_COLS, idx + 2 * C4_COLS, idx + 3 * C4_COLS])
        if (r) return r
      }
      // Diagonal ↘
      if (row <= C4_ROWS - C4_WIN_LEN && col <= C4_COLS - C4_WIN_LEN) {
        const r = check([idx, idx + C4_COLS + 1, idx + 2 * (C4_COLS + 1), idx + 3 * (C4_COLS + 1)])
        if (r) return r
      }
      // Diagonal ↙
      if (row <= C4_ROWS - C4_WIN_LEN && col >= C4_WIN_LEN - 1) {
        const r = check([idx, idx + C4_COLS - 1, idx + 2 * (C4_COLS - 1), idx + 3 * (C4_COLS - 1)])
        if (r) return r
      }
    }
  }
  return { winner: null, line: null }
}

export function deriveConnectFour(gameId: string, stmts: GameStatement[]): DerivedConnectFour | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const board = emptyC4Board()
  let winningLine: number[] | null = null

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue
    if (stmt.column == null || stmt.column < 0 || stmt.column >= C4_COLS) continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== (moveCount % 2 === 0 ? 'X' : 'O')) continue

    const landingIdx = dropDisc(board, stmt.column, symbol)
    if (landingIdx === -1) continue

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

  return {
    id: gameId,
    gameType: 'connect-four',
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
