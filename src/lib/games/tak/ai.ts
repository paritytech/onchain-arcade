import type { PlayerSymbol } from '@/types/game'
import type { TakCell, TakPiece } from '@/types/derived-game'
import { isValidPlace, isValidMove, executeMove, checkRoad } from './deriver'

type PieceType = 'flat' | 'wall' | 'capstone'
type Direction = 'N' | 'S' | 'E' | 'W'

const SIZE = 5
const MAX_CARRY = 5
const DIRECTIONS: Direction[] = ['N', 'S', 'E', 'W']
const DIR_OFFSETS: Record<Direction, [number, number]> = {
  N: [-1, 0], S: [1, 0], E: [0, 1], W: [0, -1],
}

interface PlaceAction {
  takPlace: { position: number; pieceType: PieceType }
}

interface MoveAction {
  takMove: { from: number; direction: Direction; drops: number[] }
}

type TakAction = PlaceAction | MoveAction

function cloneBoard(board: TakCell[][]): TakCell[][] {
  return board.map(row => row.map(cell => ({
    stack: cell.stack.map(p => ({ ...p })),
  })))
}

function topPiece(cell: TakCell): TakPiece | null {
  return cell.stack.length > 0 ? cell.stack[cell.stack.length - 1] : null
}

function generatePlacements(
  board: TakCell[][],
  player: PlayerSymbol,
  flatStones: number,
  capstones: number,
  firstMoveDone: boolean,
): PlaceAction[] {
  const actions: PlaceAction[] = []
  const types: PieceType[] = firstMoveDone
    ? (['flat', 'wall', 'capstone'] as const).filter(t =>
        t === 'capstone' ? capstones > 0 : flatStones > 0)
    : ['flat'] // first move must be flat

  for (let pos = 0; pos < SIZE * SIZE; pos++) {
    const [r, c] = [Math.floor(pos / SIZE), pos % SIZE]
    if (board[r][c].stack.length > 0) continue
    for (const pt of types) {
      if (isValidPlace(board, pos, pt, player, flatStones, capstones, firstMoveDone)) {
        actions.push({ takPlace: { position: pos, pieceType: pt } })
      }
    }
  }
  return actions
}

function generateDropPatterns(pickup: number, maxCells: number): number[][] {
  // Simple patterns: all-on-one for each distance, and 1-per-cell spread
  const patterns: number[][] = []

  // All on first cell
  patterns.push([pickup])

  // 1 per cell, rest on last
  if (maxCells > 1 && pickup > 1) {
    const spread: number[] = []
    let rem = pickup
    for (let i = 0; i < Math.min(maxCells, pickup); i++) {
      if (i === Math.min(maxCells, pickup) - 1) {
        spread.push(rem)
      } else {
        spread.push(1)
        rem--
      }
    }
    patterns.push(spread)
  }

  // Drop 1 per cell (if pickup allows full spread)
  if (pickup <= maxCells && pickup > 1) {
    const ones = Array(pickup).fill(1)
    // Avoid duplicate
    if (JSON.stringify(ones) !== JSON.stringify(patterns[patterns.length - 1])) {
      patterns.push(ones)
    }
  }

  return patterns
}

function generateStackMoves(board: TakCell[][], player: PlayerSymbol): MoveAction[] {
  const actions: MoveAction[] = []

  for (let pos = 0; pos < SIZE * SIZE; pos++) {
    const [r, c] = [Math.floor(pos / SIZE), pos % SIZE]
    const cell = board[r][c]
    if (cell.stack.length === 0) continue
    const top = topPiece(cell)
    if (!top || top.owner !== player) continue

    for (const dir of DIRECTIONS) {
      const [dr, dc] = DIR_OFFSETS[dir]
      const stackSize = cell.stack.length
      const pickup = Math.min(stackSize, MAX_CARRY)

      // Calculate max reachable cells
      let maxCells = 0
      let cr = r, cc = c
      for (let i = 0; i < pickup; i++) {
        cr += dr
        cc += dc
        if (cr < 0 || cr >= SIZE || cc < 0 || cc >= SIZE) break
        const dt = topPiece(board[cr][cc])
        if (dt && dt.type === 'capstone') break
        if (dt && dt.type === 'wall') { maxCells++; break }
        maxCells++
      }

      if (maxCells === 0) continue

      const patterns = generateDropPatterns(pickup, maxCells)
      for (const drops of patterns) {
        if (isValidMove(board, pos, dir, drops, player)) {
          actions.push({ takMove: { from: pos, direction: dir, drops } })
        }
      }
    }
  }
  return actions
}

function generateAllMoves(
  board: TakCell[][],
  player: PlayerSymbol,
  flatStones: number,
  capstones: number,
  firstMoveDone: boolean,
): TakAction[] {
  const placements = generatePlacements(board, player, flatStones, capstones, firstMoveDone)
  if (!firstMoveDone) return placements
  const stackMoves = generateStackMoves(board, player)
  return [...placements, ...stackMoves]
}

function applyAction(
  board: TakCell[][],
  action: TakAction,
  player: PlayerSymbol,
  firstMoveDone: boolean,
): TakCell[][] {
  const b = cloneBoard(board)

  if ('takPlace' in action) {
    const { position, pieceType } = action.takPlace
    const [r, c] = [Math.floor(position / SIZE), position % SIZE]
    const owner = !firstMoveDone ? (player === 'X' ? 'O' : 'X') : player
    b[r][c].stack.push({ owner, type: pieceType })
  } else {
    const { from, direction, drops } = action.takMove
    executeMove(b, from, direction, drops)
  }

  return b
}

function evaluate(board: TakCell[][], player: PlayerSymbol): number {
  const opp: PlayerSymbol = player === 'X' ? 'O' : 'X'
  let score = 0

  // Road check — instant win/loss
  if (checkRoad(board, player)) return 100000
  if (checkRoad(board, opp)) return -100000

  // Flat control: count top flats
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const top = topPiece(board[r][c])
      if (!top) continue
      if (top.owner === player) {
        score += top.type === 'flat' ? 10 : top.type === 'capstone' ? 15 : 2
      } else {
        score -= top.type === 'flat' ? 10 : top.type === 'capstone' ? 15 : 2
      }
    }
  }

  // Stack ownership: own pieces deeper in stacks have value
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const { stack } = board[r][c]
      for (let i = 0; i < stack.length - 1; i++) {
        if (stack[i].owner === player) score += 1
        else score -= 1
      }
    }
  }

  // Road proximity: connected groups touching edges
  score += roadProximity(board, player) * 5
  score -= roadProximity(board, opp) * 5

  return score
}

function roadProximity(board: TakCell[][], player: PlayerSymbol): number {
  // Count how many edge cells the player's largest connected group touches
  const visited = new Set<number>()
  let bestEdgeCount = 0

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const pos = r * SIZE + c
      if (visited.has(pos)) continue
      const top = topPiece(board[r][c])
      if (!top || top.owner !== player || top.type === 'wall') continue

      // BFS to find connected group
      const group = new Set<number>()
      const queue: [number, number][] = [[r, c]]
      visited.add(pos)
      group.add(pos)

      while (queue.length > 0) {
        const [cr, cc] = queue.shift()!
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          const nr = cr + dr, nc = cc + dc
          if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue
          const npos = nr * SIZE + nc
          if (visited.has(npos)) continue
          const nt = topPiece(board[nr][nc])
          if (nt && nt.owner === player && nt.type !== 'wall') {
            visited.add(npos)
            group.add(npos)
            queue.push([nr, nc])
          }
        }
      }

      // Count unique edges touched
      let edgeCount = 0
      let touchesTop = false, touchesBottom = false, touchesLeft = false, touchesRight = false
      for (const p of group) {
        const pr = Math.floor(p / SIZE), pc = p % SIZE
        if (pr === 0) touchesTop = true
        if (pr === SIZE - 1) touchesBottom = true
        if (pc === 0) touchesLeft = true
        if (pc === SIZE - 1) touchesRight = true
      }
      edgeCount = (touchesTop ? 1 : 0) + (touchesBottom ? 1 : 0) + (touchesLeft ? 1 : 0) + (touchesRight ? 1 : 0)
      bestEdgeCount = Math.max(bestEdgeCount, edgeCount)
    }
  }

  return bestEdgeCount
}

function minimax(
  board: TakCell[][],
  depth: number,
  isMax: boolean,
  player: PlayerSymbol,
  flatStones: { X: number; O: number },
  capstones: { X: number; O: number },
  firstMoveDone: { X: boolean; O: boolean },
  alpha: number,
  beta: number,
): number {
  if (depth === 0) return evaluate(board, player)

  const opp: PlayerSymbol = player === 'X' ? 'O' : 'X'
  const current = isMax ? player : opp
  const moves = generateAllMoves(board, current, flatStones[current], capstones[current], firstMoveDone[current])

  if (moves.length === 0) return evaluate(board, player)

  if (isMax) {
    let best = -Infinity
    for (const move of moves) {
      const newBoard = applyAction(board, move, current, firstMoveDone[current])
      const newFlats = { ...flatStones }
      const newCaps = { ...capstones }
      const newFirst = { ...firstMoveDone }
      if ('takPlace' in move) {
        if (move.takPlace.pieceType === 'capstone') newCaps[current]--
        else newFlats[current]--
        if (!newFirst[current]) newFirst[current] = true
      }
      const val = minimax(newBoard, depth - 1, false, player, newFlats, newCaps, newFirst, alpha, beta)
      best = Math.max(best, val)
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const move of moves) {
      const newBoard = applyAction(board, move, current, firstMoveDone[current])
      const newFlats = { ...flatStones }
      const newCaps = { ...capstones }
      const newFirst = { ...firstMoveDone }
      if ('takPlace' in move) {
        if (move.takPlace.pieceType === 'capstone') newCaps[current]--
        else newFlats[current]--
        if (!newFirst[current]) newFirst[current] = true
      }
      const val = minimax(newBoard, depth - 1, true, player, newFlats, newCaps, newFirst, alpha, beta)
      best = Math.min(best, val)
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

export function getBestTakMove(
  board: TakCell[][],
  flatStones: { X: number; O: number },
  capstones: { X: number; O: number },
  player: PlayerSymbol,
  firstMoveDone: { X: boolean; O: boolean },
): TakAction | null {
  const moves = generateAllMoves(board, player, flatStones[player], capstones[player], firstMoveDone[player])
  if (moves.length === 0) return null
  if (moves.length === 1) return moves[0]

  let bestScore = -Infinity
  let bestMove = moves[0]

  for (const move of moves) {
    const newBoard = applyAction(board, move, player, firstMoveDone[player])
    const newFlats = { ...flatStones }
    const newCaps = { ...capstones }
    const newFirst = { ...firstMoveDone }
    if ('takPlace' in move) {
      if (move.takPlace.pieceType === 'capstone') newCaps[player]--
      else newFlats[player]--
      if (!newFirst[player]) newFirst[player] = true
    }

    // Check for instant road win
    if (checkRoad(newBoard, player)) return move

    const score = minimax(newBoard, 1, false, player, newFlats, newCaps, newFirst, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
