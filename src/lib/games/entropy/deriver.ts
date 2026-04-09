import type { GameStatement, PlayerSymbol } from '@/types/game'
import type { DerivedEntropy, EntropyColor } from '@/types/derived-game'
import { initGameState } from '../shared'

const SIZE = 7
const TOTAL_CELLS = SIZE * SIZE        // 49
const TOTAL_PIECES = 35                 // 5 colors x 7
const COLORS: EntropyColor[] = ['R', 'G', 'B', 'Y', 'P']

// --- Seeded PRNG (mulberry32) ---

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

export function generatePieceQueue(seed: number): EntropyColor[] {
  const pieces: EntropyColor[] = []
  for (const color of COLORS) {
    for (let i = 0; i < 7; i++) pieces.push(color)
  }
  // Fisher-Yates shuffle with seeded PRNG
  const rng = mulberry32(seed)
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]]
  }
  return pieces
}

// --- Scoring ---

export function scoreBoard(board: (EntropyColor | null)[]): number {
  let total = 0

  for (let r = 0; r < SIZE; r++) {
    // Score row
    total += scoreLine(board, r * SIZE, 1, SIZE)
    // Score column
    total += scoreLine(board, r, SIZE, SIZE)
  }

  return total
}

function scoreLine(board: (EntropyColor | null)[], start: number, step: number, count: number): number {
  let score = 0
  let runLen = 0
  let runColor: EntropyColor | null = null

  for (let i = 0; i < count; i++) {
    const cell = board[start + i * step]
    if (cell !== null && cell === runColor) {
      runLen++
    } else {
      if (runLen >= 2) score += (runLen * (runLen - 1)) / 2
      runColor = cell
      runLen = cell !== null ? 1 : 0
    }
  }
  if (runLen >= 2) score += (runLen * (runLen - 1)) / 2

  return score
}

// --- Slide validation ---

export function getValidSlideTargets(board: (EntropyColor | null)[], from: number): number[] {
  const targets: number[] = []
  const row = Math.floor(from / SIZE)
  const col = from % SIZE

  // Four orthogonal directions: up, down, left, right
  const directions = [
    { dr: -1, dc: 0 },  // up
    { dr: 1, dc: 0 },   // down
    { dr: 0, dc: -1 },  // left
    { dr: 0, dc: 1 },   // right
  ]

  for (const { dr, dc } of directions) {
    let r = row + dr
    let c = col + dc
    // Must be adjacent empty cell (no jumping over pieces)
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
      const idx = r * SIZE + c
      if (board[idx] !== null) break // blocked by piece
      targets.push(idx)
      r += dr
      c += dc
    }
  }

  return targets
}

// --- Deriver ---

export function deriveEntropy(gameId: string, stmts: GameStatement[]): DerivedEntropy | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const seed = create.entropyConfig?.seed ?? create.timestamp
  const queue1 = generatePieceQueue(seed)
  const queue2 = generatePieceQueue(seed + 1)

  let board: (EntropyColor | null)[] = Array(TOTAL_CELLS).fill(null)
  let piecesPlaced = 0
  let round: 1 | 2 = 1
  let phase: 'chaos' | 'order' = 'chaos'
  let scores: { X: number; O: number } = { X: 0, O: 0 }

  // In round 1: X=Chaos, O=Order. In round 2: X=Order, O=Chaos.
  let chaosPlayer: PlayerSymbol = 'X'
  let orderPlayer: PlayerSymbol = 'O'
  let currentTurn: PlayerSymbol = chaosPlayer // Chaos goes first

  function currentQueue(): EntropyColor[] {
    return round === 1 ? queue1 : queue2
  }

  function finishRound() {
    const roundScore = scoreBoard(board)
    // Order player gets the score (Order wants high score, Chaos wants low)
    scores[orderPlayer] += roundScore

    if (round === 1) {
      // Reset for round 2
      round = 2
      board = Array(TOTAL_CELLS).fill(null)
      piecesPlaced = 0
      phase = 'chaos'
      // Swap roles: X becomes Order, O becomes Chaos
      chaosPlayer = 'O'
      orderPlayer = 'X'
      currentTurn = chaosPlayer
    } else {
      // Game over after round 2
      status = 'finished'
      if (scores.X > scores.O) result = 'x_wins'
      else if (scores.O > scores.X) result = 'o_wins'
      else result = 'draw'
    }
  }

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== currentTurn) continue

    if (phase === 'chaos') {
      // Chaos places a piece
      if (stmt.entropyPlace == null) continue
      const cell = stmt.entropyPlace
      if (cell < 0 || cell >= TOTAL_CELLS) continue
      if (board[cell] !== null) continue // must be empty

      const queue = currentQueue()
      board[cell] = queue[piecesPlaced]
      piecesPlaced++
      moveCount++
      updatedAt = stmt.timestamp

      // Switch to Order phase (Order always gets a slide/pass after each Chaos placement,
      // including after the final piece — Order's pass then triggers finishRound)
      phase = 'order'
      currentTurn = orderPlayer
    } else {
      // Order slides or passes
      if (stmt.entropyPass) {
        moveCount++
        updatedAt = stmt.timestamp

        if (piecesPlaced >= TOTAL_PIECES) {
          finishRound()
        } else {
          phase = 'chaos'
          currentTurn = chaosPlayer
        }
      } else if (stmt.entropySlide) {
        const { from, to } = stmt.entropySlide
        if (from < 0 || from >= TOTAL_CELLS || to < 0 || to >= TOTAL_CELLS) continue
        if (board[from] === null) continue // must have a piece
        if (board[to] !== null) continue   // destination must be empty

        const validTargets = getValidSlideTargets(board, from)
        if (!validTargets.includes(to)) continue

        board[to] = board[from]
        board[from] = null
        moveCount++
        updatedAt = stmt.timestamp

        if (piecesPlaced >= TOTAL_PIECES) {
          finishRound()
        } else {
          phase = 'chaos'
          currentTurn = chaosPlayer
        }
      }
    }
  }

  const queue = currentQueue()
  const nextPiece = piecesPlaced < TOTAL_PIECES ? queue[piecesPlaced] : null

  return {
    id: gameId,
    gameType: 'entropy',
    board,
    nextPiece,
    piecesPlaced,
    round,
    phase,
    scores,
    chaosPlayer,
    orderPlayer,
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: init.playerO,
    playerOName: init.playerOName,
    currentTurn,
    status,
    result,
    moveCount,
    vsComputer: create.vsComputer ?? false,
    createdAt: create.timestamp,
    updatedAt,
  }
}
