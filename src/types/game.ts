export type CellValue = 'X' | 'O' | null;
export type BoardState = CellValue[];
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type GameResult = 'x_wins' | 'o_wins' | 'draw' | null;
export type PlayerSymbol = 'X' | 'O';
export type GridSize = 3 | 5 | 7;
export type GameType = 'tic-tac-toe' | 'connect-four' | 'nim' | 'dots-and-boxes' | 'mancala' | 'reversi' | 'ghost' | 'hackenbush' | 'entropy' | 'blokus-duo' | 'tak' | 'emoji-pictionary';

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

/**
 * Alphabet for newly generated game codes.
 *
 * Crockford Base32's letter set: A-Z minus **I, L, O, U**, plus digits. The
 * exclusions are not arbitrary — I/1, L/1 and O/0 are the transcription
 * confusions people actually make, and U is dropped so a random code cannot
 * spell an obscenity. Jackbox learned that one reactively and had to add a
 * filter afterwards.
 * (https://datatracker.ietf.org/doc/draft-crockford-davis-base32-for-humans/01/)
 *
 * 0 and 1 are dropped as well, so no generated code contains a glyph that
 * could be read as a letter. 30 symbols x 6 places is ~7.3e8 codes, which is
 * collision headroom this app will never need.
 *
 * The previous alphabet kept L and U. Codes already in circulation therefore
 * contain them, which is why {@link isValidGameId} accepts a WIDER set than
 * this one generates — narrowing the generator must not invalidate a link
 * somebody already shared.
 */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';

/** Characters that have ever been generated, for validating an inbound code. */
const LEGACY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const GAME_ID_LENGTH = 6;

/**
 * Substrings that make a code unusable in public. Checked against the whole
 * code, so a hit anywhere triggers a regenerate. Short and English-only on
 * purpose: this catches the cases that would embarrass someone sharing a link,
 * not every possible reading.
 */
const FORBIDDEN = ['ASS', 'CNT', 'CUM', 'FAG', 'FCK', 'JEW', 'KKK', 'NGR', 'PIS', 'SEX', 'SHT', 'TIT', 'WTF'];

function spellsSomethingUnfortunate(code: string): boolean {
  return FORBIDDEN.some((word) => code.includes(word));
}

export function generateGameId(): string {
  // Bounded rather than `while (true)`: the deny-list is tiny, so a second
  // attempt effectively always clears it, and an unbounded loop over a
  // misconfigured list would hang the create-game click.
  for (let attempt = 0; attempt < 8; attempt++) {
    let result = '';
    for (let i = 0; i < GAME_ID_LENGTH; i++) {
      result += CODE_ALPHABET.charAt(Math.floor(Math.random() * CODE_ALPHABET.length));
    }
    if (!spellsSomethingUnfortunate(result)) return result;
  }
  // Exhausted the attempts — return a code from a run that cannot contain a
  // vowel-bearing word rather than looping forever.
  let fallback = '';
  for (let i = 0; i < GAME_ID_LENGTH; i++) {
    fallback += '23456789'.charAt(Math.floor(Math.random() * 8));
  }
  return fallback;
}

/**
 * Make a human-supplied code usable: uppercase, drop separators, and absorb the
 * transcription confusions rather than making the player notice them.
 *
 * Crockford's insight is that the DECODER should carry the ambiguity. `1` and
 * `I` are never generated, so someone typing either of them read an `L` off a
 * screen or heard it in a voice call — which is exactly the mistake mapping
 * them to `L` fixes. `0` and `O` are left alone: neither is generated and
 * neither maps to anything unambiguous, so a clear rejection beats a guess.
 */
export function normalizeGameId(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/[1I]/g, 'L')
    .slice(0, GAME_ID_LENGTH);
}

/**
 * Is this a code we could have issued? Validates against the WIDER legacy
 * alphabet, so links shared before the generator narrowed still resolve.
 */
export function isValidGameId(code: string): boolean {
  if (code.length !== GAME_ID_LENGTH) return false;
  for (const ch of code) {
    if (!LEGACY_ALPHABET.includes(ch)) return false;
  }
  return true;
}

// --- Statement types for the statement store ---

export interface CreateGameStatement {
  type: 'create_game'
  gameId: string
  playerX: string
  playerXName?: string
  gameType?: GameType
  gridSize?: GridSize
  nimConfig?: number[]
  vsComputer?: boolean
  hackenbushConfig?: string
  entropyConfig?: { seed?: number }
  maxPlayers?: number
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
  cellIndex?: number
  column?: number
  nimMove?: { heap: number; count: number }
  edge?: string
  pit?: number
  ghostLetter?: string
  ghostChallenge?: boolean
  hackenbushEdge?: number
  entropyPlace?: number
  entropySlide?: { from: number; to: number }
  entropyPass?: boolean
  blokusMove?: { pieceId: number; position: number; rotation: number; flip: boolean }
  blokusPass?: boolean
  takPlace?: { position: number; pieceType: 'flat' | 'wall' | 'capstone' }
  takMove?: { from: number; direction: 'N' | 'S' | 'E' | 'W'; drops: number[] }
  emojiClue?: string
  guess?: string
  skipRound?: boolean
  timestamp: number
}

export type GameStatement = CreateGameStatement | JoinGameStatement | MakeMoveStatement
