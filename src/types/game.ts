export type CellValue = 'X' | 'O' | null;
export type BoardState = CellValue[];
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type GameResult = 'x_wins' | 'o_wins' | 'draw' | null;
export type PlayerSymbol = 'X' | 'O';
export type GridSize = 3 | 5 | 7;

/** Win-length required for each grid size */
export const WIN_LENGTH: Record<GridSize, number> = { 3: 3, 5: 4, 7: 5 };

export function emptyBoard(gridSize: GridSize = 3): BoardState {
  return Array(gridSize * gridSize).fill(null);
}

/** For backwards compat — 3x3 empty board */
export const EMPTY_BOARD: BoardState = emptyBoard(3);

/**
 * Generate all winning lines for a given grid size and win length.
 * Rows, columns, and diagonals of `winLen` consecutive cells.
 */
export function generateWinningLines(gridSize: GridSize): number[][] {
  const winLen = WIN_LENGTH[gridSize];
  const lines: number[][] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Horizontal →
      if (col + winLen <= gridSize) {
        lines.push(Array.from({ length: winLen }, (_, i) => row * gridSize + col + i));
      }
      // Vertical ↓
      if (row + winLen <= gridSize) {
        lines.push(Array.from({ length: winLen }, (_, i) => (row + i) * gridSize + col));
      }
      // Diagonal ↘
      if (row + winLen <= gridSize && col + winLen <= gridSize) {
        lines.push(Array.from({ length: winLen }, (_, i) => (row + i) * gridSize + col + i));
      }
      // Diagonal ↙
      if (row + winLen <= gridSize && col - winLen + 1 >= 0) {
        lines.push(Array.from({ length: winLen }, (_, i) => (row + i) * gridSize + col - i));
      }
    }
  }

  return lines;
}

/** Precomputed lines for the default 3x3 grid */
export const WINNING_LINES: number[][] = generateWinningLines(3);

export function checkWinner(board: BoardState, gridSize: GridSize = 3): { winner: PlayerSymbol | null; line: number[] | null } {
  const lines = gridSize === 3 ? WINNING_LINES : generateWinningLines(gridSize);
  for (const line of lines) {
    const first = board[line[0]];
    if (first && line.every(i => board[i] === first)) {
      return { winner: first as PlayerSymbol, line };
    }
  }
  return { winner: null, line: null };
}

export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

export function generateGameId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- Statement types for the statement store ---

export interface CreateGameStatement {
  type: 'create_game'
  gameId: string
  playerX: string
  playerXName?: string
  gridSize?: GridSize
  timestamp: number
}

export interface JoinGameStatement {
  type: 'join_game'
  gameId: string
  playerO: string
  playerOName?: string
  timestamp: number
}

export interface MakeMoveStatement {
  type: 'make_move'
  gameId: string
  player: string
  cellIndex: number
  timestamp: number
}

export type GameStatement = CreateGameStatement | JoinGameStatement | MakeMoveStatement
