import type { GameStatement, PlayerSymbol } from '@/types/game'
import type { DerivedTak, TakCell, TakPiece } from '@/types/derived-game'
import { initGameState } from '../shared'

const SIZE = 5
const MAX_CARRY = 5
const INITIAL_FLATS = 21
const INITIAL_CAPSTONES = 1

const DIR_OFFSETS: Record<string, [number, number]> = {
  N: [-1, 0],
  S: [1, 0],
  E: [0, 1],
  W: [0, -1],
}

function emptyBoard(): TakCell[][] {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({ stack: [] })),
  )
}

function posToRC(pos: number): [number, number] {
  return [Math.floor(pos / SIZE), pos % SIZE]
}

function rcToPos(r: number, c: number): number {
  return r * SIZE + c
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE
}

function topPiece(cell: TakCell): TakPiece | null {
  return cell.stack.length > 0 ? cell.stack[cell.stack.length - 1] : null
}


export function isValidPlace(
  board: TakCell[][],
  pos: number,
  pieceType: 'flat' | 'wall' | 'capstone',
  _player: PlayerSymbol,
  flatStones: number,
  capstones: number,
  firstMoveDone: boolean,
): boolean {
  const [r, c] = posToRC(pos)
  if (!inBounds(r, c)) return false
  if (board[r][c].stack.length > 0) return false

  // First move must be opponent's flat stone
  if (!firstMoveDone) {
    return pieceType === 'flat'
  }

  if (pieceType === 'capstone') return capstones > 0
  return flatStones > 0
}

export function isValidMove(
  board: TakCell[][],
  from: number,
  direction: string,
  drops: number[],
  player: PlayerSymbol,
): boolean {
  const [r, c] = posToRC(from)
  if (!inBounds(r, c)) return false

  const cell = board[r][c]
  if (cell.stack.length === 0) return false

  const top = topPiece(cell)
  if (!top || top.owner !== player) return false

  const totalPickup = drops.reduce((a, b) => a + b, 0)
  if (totalPickup < 1 || totalPickup > Math.min(cell.stack.length, MAX_CARRY)) return false
  if (drops.length === 0) return false
  if (drops.some(d => d < 1)) return false

  const offset = DIR_OFFSETS[direction]
  if (!offset) return false
  const [dr, dc] = offset

  // Check each destination cell
  const pickedUp = cell.stack.slice(cell.stack.length - totalPickup)
  let cr = r, cc = c
  let pieceIdx = 0

  for (let i = 0; i < drops.length; i++) {
    cr += dr
    cc += dc
    if (!inBounds(cr, cc)) return false

    const dest = board[cr][cc]
    const destTop = topPiece(dest)

    if (destTop) {
      if (destTop.type === 'capstone') return false // can never move onto capstone
      if (destTop.type === 'wall') {
        // Only capstone can flatten wall, and only as the very last drop of exactly 1
        const isLastDrop = i === drops.length - 1
        const droppingOne = drops[i] === 1
        const droppedPiece = pickedUp[pieceIdx + drops[i] - 1]
        if (!(isLastDrop && droppingOne && droppedPiece.type === 'capstone')) return false
      }
    }

    pieceIdx += drops[i]
  }

  return true
}

export function executeMove(
  board: TakCell[][],
  from: number,
  direction: string,
  drops: number[],
): void {
  const [r, c] = posToRC(from)
  const cell = board[r][c]
  const totalPickup = drops.reduce((a, b) => a + b, 0)
  const pickedUp = cell.stack.splice(cell.stack.length - totalPickup, totalPickup)

  const [dr, dc] = DIR_OFFSETS[direction]
  let cr = r, cc = c
  let pieceIdx = 0

  for (let i = 0; i < drops.length; i++) {
    cr += dr
    cc += dc
    const dest = board[cr][cc]
    const destTop = topPiece(dest)

    // Flatten wall if capstone moves onto it
    if (destTop && destTop.type === 'wall') {
      destTop.type = 'flat'
    }

    const toDrop = pickedUp.slice(pieceIdx, pieceIdx + drops[i])
    dest.stack.push(...toDrop)
    pieceIdx += drops[i]
  }
}

export function checkRoad(board: TakCell[][], player: PlayerSymbol): number[] | null {
  // Check horizontal road (left edge to right edge)
  const hResult = findRoad(board, player, 'horizontal')
  if (hResult) return hResult

  // Check vertical road (top edge to bottom edge)
  const vResult = findRoad(board, player, 'vertical')
  if (vResult) return vResult

  return null
}

function findRoad(
  board: TakCell[][],
  player: PlayerSymbol,
  axis: 'horizontal' | 'vertical',
): number[] | null {
  const startEdge: [number, number][] = []
  const isEndEdge = (r: number, c: number) => {
    return axis === 'horizontal' ? c === SIZE - 1 : r === SIZE - 1
  }

  // Collect starting edge cells owned by player (flat or capstone)
  for (let i = 0; i < SIZE; i++) {
    const r = axis === 'horizontal' ? i : 0
    const c = axis === 'horizontal' ? 0 : i
    const top = topPiece(board[r][c])
    if (top && top.owner === player && (top.type === 'flat' || top.type === 'capstone')) {
      startEdge.push([r, c])
    }
  }

  // BFS from each start cell
  for (const start of startEdge) {
    const visited = new Set<number>()
    const parent = new Map<number, number>()
    const queue: [number, number][] = [start]
    const startPos = rcToPos(start[0], start[1])
    visited.add(startPos)

    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!
      if (isEndEdge(cr, cc)) {
        // Reconstruct path
        const path: number[] = []
        let pos = rcToPos(cr, cc)
        while (pos !== undefined) {
          path.push(pos)
          const p = parent.get(pos)
          if (p === undefined) break
          pos = p
        }
        return path.reverse()
      }

      // Explore 4 neighbors
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const nr = cr + dr, nc = cc + dc
        if (!inBounds(nr, nc)) continue
        const npos = rcToPos(nr, nc)
        if (visited.has(npos)) continue
        const top = topPiece(board[nr][nc])
        if (top && top.owner === player && (top.type === 'flat' || top.type === 'capstone')) {
          visited.add(npos)
          parent.set(npos, rcToPos(cr, cc))
          queue.push([nr, nc])
        }
      }
    }
  }

  return null
}

function isBoardFull(board: TakCell[][]): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c].stack.length === 0) return false
    }
  }
  return true
}

function countTopFlats(board: TakCell[][]): { X: number; O: number } {
  let X = 0, O = 0
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const top = topPiece(board[r][c])
      if (top && top.type === 'flat') {
        if (top.owner === 'X') X++
        else O++
      }
    }
  }
  return { X, O }
}

function hasNoPieces(flatStones: number, capstones: number): boolean {
  return flatStones <= 0 && capstones <= 0
}

export function deriveTak(gameId: string, stmts: GameStatement[]): DerivedTak | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const board = emptyBoard()
  let currentTurn: PlayerSymbol = 'X'
  const flatStones = { X: INITIAL_FLATS, O: INITIAL_FLATS }
  const capstones = { X: INITIAL_CAPSTONES, O: INITIAL_CAPSTONES }
  const firstMoveDone = { X: false, O: false }
  let road: number[] | null = null

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== currentTurn) continue

    let validMove = false

    if (stmt.takPlace) {
      const { position, pieceType } = stmt.takPlace
      const placingPlayer = !firstMoveDone[symbol] ? (symbol === 'X' ? 'O' : 'X') : symbol

      if (isValidPlace(board, position, pieceType, symbol, flatStones[symbol], capstones[symbol], firstMoveDone[symbol])) {
        const [r, c] = posToRC(position)
        board[r][c].stack.push({ owner: placingPlayer, type: pieceType })

        // Deduct from the current player's reserves (not the placed piece's owner for first move)
        if (pieceType === 'capstone') capstones[symbol]--
        else flatStones[symbol]--

        if (!firstMoveDone[symbol]) firstMoveDone[symbol] = true
        validMove = true
      }
    } else if (stmt.takMove) {
      const { from, direction, drops } = stmt.takMove

      // Can't use stack movement if first move not done
      if (!firstMoveDone[symbol]) continue

      if (isValidMove(board, from, direction, drops, symbol)) {
        executeMove(board, from, direction, drops)
        validMove = true
      }
    }

    if (!validMove) continue

    moveCount++
    updatedAt = stmt.timestamp

    // Check road win
    const roadX = checkRoad(board, 'X')
    const roadO = checkRoad(board, 'O')

    if (roadX && roadO) {
      // Current player (who just moved) wins if they completed a road
      road = symbol === 'X' ? roadX : roadO
      result = symbol === 'X' ? 'x_wins' : 'o_wins'
      status = 'finished'
    } else if (roadX) {
      road = roadX
      result = 'x_wins'
      status = 'finished'
    } else if (roadO) {
      road = roadO
      result = 'o_wins'
      status = 'finished'
    }

    // Check flat win (board full or either player has no pieces)
    if (status !== 'finished') {
      const opponent: PlayerSymbol = symbol === 'X' ? 'O' : 'X'
      if (isBoardFull(board) || hasNoPieces(flatStones[symbol], capstones[symbol]) || hasNoPieces(flatStones[opponent], capstones[opponent])) {
        const topFlats = countTopFlats(board)
        if (topFlats.X > topFlats.O) result = 'x_wins'
        else if (topFlats.O > topFlats.X) result = 'o_wins'
        else result = 'draw'
        status = 'finished'
      }
    }

    if (status !== 'finished') {
      currentTurn = currentTurn === 'X' ? 'O' : 'X'
    }
  }

  return {
    id: gameId,
    gameType: 'tak',
    board,
    flatStones,
    capstones,
    road,
    firstMoveDone,
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
