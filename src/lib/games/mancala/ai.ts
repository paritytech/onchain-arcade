const X_STORE = 6
const O_STORE = 13
const MAX_DEPTH = 6

function clonePits(pits: number[]): number[] { return [...pits] }

function isPlayerXPit(pit: number): boolean { return pit >= 0 && pit <= 5 }
function isPlayerOPit(pit: number): boolean { return pit >= 7 && pit <= 12 }

function getValidPits(pits: number[], isPlayerX: boolean): number[] {
  const result: number[] = []
  const start = isPlayerX ? 0 : 7
  const end = isPlayerX ? 5 : 12
  for (let i = start; i <= end; i++) {
    if (pits[i] > 0) result.push(i)
  }
  return result
}

function simulateSow(pits: number[], pitIndex: number, isPlayerX: boolean): { pits: number[]; lastIdx: number; extraTurn: boolean; captured: boolean } {
  const p = clonePits(pits)
  let stones = p[pitIndex]
  p[pitIndex] = 0
  let current = pitIndex
  const skipStore = isPlayerX ? O_STORE : X_STORE

  while (stones > 0) {
    current = (current + 1) % 14
    if (current === skipStore) continue
    p[current]++
    stones--
  }

  const ownStore = isPlayerX ? X_STORE : O_STORE
  const extraTurn = current === ownStore

  // Capture
  let captured = false
  const isOwnSide = isPlayerX ? isPlayerXPit(current) : isPlayerOPit(current)
  if (isOwnSide && p[current] === 1) {
    const opp = 12 - current
    if (p[opp] > 0) {
      p[ownStore] += p[opp] + 1
      p[opp] = 0
      p[current] = 0
      captured = true
    }
  }

  // Check endgame
  const xEmpty = p.slice(0, 6).every(v => v === 0)
  const oEmpty = p.slice(7, 13).every(v => v === 0)
  if (xEmpty || oEmpty) {
    for (let i = 0; i < 6; i++) { p[X_STORE] += p[i]; p[i] = 0 }
    for (let i = 7; i < 13; i++) { p[O_STORE] += p[i]; p[i] = 0 }
  }

  return { pits: p, lastIdx: current, extraTurn, captured }
}

function evaluate(pits: number[], isPlayerX: boolean): number {
  return isPlayerX ? pits[X_STORE] - pits[O_STORE] : pits[O_STORE] - pits[X_STORE]
}

function isGameOver(pits: number[]): boolean {
  return pits.slice(0, 6).every(v => v === 0) || pits.slice(7, 13).every(v => v === 0)
}

function minimax(pits: number[], depth: number, isMaximizing: boolean, maximizerIsX: boolean, alpha: number, beta: number): number {
  if (depth === 0 || isGameOver(pits)) return evaluate(pits, maximizerIsX)

  const isCurrentX = isMaximizing ? maximizerIsX : !maximizerIsX
  const validPits = getValidPits(pits, isCurrentX)
  if (validPits.length === 0) return evaluate(pits, maximizerIsX)

  if (isMaximizing) {
    let best = -Infinity
    for (const pit of validPits) {
      const result = simulateSow(pits, pit, isCurrentX)
      const nextIsMax = result.extraTurn ? true : false
      best = Math.max(best, minimax(result.pits, depth - 1, nextIsMax, maximizerIsX, alpha, beta))
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (const pit of validPits) {
      const result = simulateSow(pits, pit, isCurrentX)
      const nextIsMax = result.extraTurn ? false : true
      best = Math.min(best, minimax(result.pits, depth - 1, nextIsMax, maximizerIsX, alpha, beta))
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

export function getBestPitMove(pits: number[], isPlayerX: boolean): number {
  const validPits = getValidPits(pits, isPlayerX)
  if (validPits.length === 0) return -1

  let bestScore = -Infinity
  let bestPit = validPits[0]

  for (const pit of validPits) {
    const result = simulateSow(pits, pit, isPlayerX)
    const nextIsMax = result.extraTurn
    const score = minimax(result.pits, MAX_DEPTH - 1, nextIsMax, isPlayerX, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestPit = pit
    }
  }

  return bestPit
}
