export type CellValue = 'X' | 'O' | null;
export type BoardState = [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue];
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type GameResult = 'x_wins' | 'o_wins' | 'draw' | null;
export type PlayerSymbol = 'X' | 'O';

export const EMPTY_BOARD: BoardState = [null, null, null, null, null, null, null, null, null];

export const WINNING_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function checkWinner(board: BoardState): { winner: PlayerSymbol | null; line: number[] | null } {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as PlayerSymbol, line };
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
  timestamp: number
}

export interface JoinGameStatement {
  type: 'join_game'
  gameId: string
  playerO: string
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
