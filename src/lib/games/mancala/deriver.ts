import type { GameStatement, PlayerSymbol } from '@/types/game'
import type { DerivedMancala } from '@/types/derived-game'
import { initGameState } from '../shared'

const INITIAL_STONES = 4
const X_STORE = 6
const O_STORE = 13

function initialPits(): number[] {
  const pits = Array(14).fill(INITIAL_STONES)
  pits[X_STORE] = 0
  pits[O_STORE] = 0
  return pits
}

function isPlayerXPit(pit: number): boolean { return pit >= 0 && pit <= 5 }
function isPlayerOPit(pit: number): boolean { return pit >= 7 && pit <= 12 }
function oppositePit(pit: number): number { return 12 - pit }

function sow(pits: number[], pitIndex: number, isPlayerX: boolean): number {
  let stones = pits[pitIndex]
  pits[pitIndex] = 0
  let current = pitIndex
  const skipStore = isPlayerX ? O_STORE : X_STORE

  while (stones > 0) {
    current = (current + 1) % 14
    if (current === skipStore) continue
    pits[current]++
    stones--
  }
  return current
}

function checkEndgame(pits: number[]): boolean {
  const xEmpty = pits.slice(0, 6).every(p => p === 0)
  const oEmpty = pits.slice(7, 13).every(p => p === 0)
  return xEmpty || oEmpty
}

function sweepRemaining(pits: number[]) {
  for (let i = 0; i < 6; i++) { pits[X_STORE] += pits[i]; pits[i] = 0 }
  for (let i = 7; i < 13; i++) { pits[O_STORE] += pits[i]; pits[i] = 0 }
}

export function deriveMancala(gameId: string, stmts: GameStatement[]): DerivedMancala | null {
  const init = initGameState(gameId, stmts)
  if (!init) return null

  const { relevant, create } = init
  let { status, result, moveCount, updatedAt } = init

  const pits = initialPits()
  let currentTurn: PlayerSymbol = 'X'
  let lastSowEnd: number | null = null

  for (const stmt of relevant) {
    if (stmt.type !== 'make_move') continue
    if (status !== 'playing') continue
    if (stmt.pit == null) continue

    const isX = stmt.player === create.playerX
    const symbol: PlayerSymbol = isX ? 'X' : 'O'
    if (symbol !== currentTurn) continue

    // Validate pit is on player's side and has stones
    if (isX && !isPlayerXPit(stmt.pit)) continue
    if (!isX && !isPlayerOPit(stmt.pit)) continue
    if (pits[stmt.pit] === 0) continue

    const lastIdx = sow(pits, stmt.pit, isX)
    lastSowEnd = lastIdx
    moveCount++
    updatedAt = stmt.timestamp

    // Capture: last stone in empty own pit (was 1 after sow, meaning it was 0 before)
    const ownStore = isX ? X_STORE : O_STORE
    const isOwnSide = isX ? isPlayerXPit(lastIdx) : isPlayerOPit(lastIdx)
    if (isOwnSide && pits[lastIdx] === 1) {
      const opp = oppositePit(lastIdx)
      if (pits[opp] > 0) {
        pits[ownStore] += pits[opp] + 1
        pits[opp] = 0
        pits[lastIdx] = 0
      }
    }

    // Check endgame
    if (checkEndgame(pits)) {
      sweepRemaining(pits)
      status = 'finished'
      if (pits[X_STORE] > pits[O_STORE]) result = 'x_wins'
      else if (pits[O_STORE] > pits[X_STORE]) result = 'o_wins'
      else result = 'draw'
    } else {
      // Extra turn if last stone landed in own store
      if (lastIdx !== ownStore) {
        currentTurn = currentTurn === 'X' ? 'O' : 'X'
      }
    }
  }

  return {
    id: gameId,
    gameType: 'mancala',
    pits,
    lastSowEnd,
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
