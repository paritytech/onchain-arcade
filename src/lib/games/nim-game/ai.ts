/**
 * Optimal Nim AI using XOR (nim-sum) strategy.
 * Adjusted for misère variant (taking the last object loses).
 */
export function getBestNimMove(heaps: number[]): { heap: number; count: number } {
  const nimSum = heaps.reduce((xor, h) => xor ^ h, 0)

  // Misère endgame: when all heaps are 0 or 1, play opposite of normal
  const allSmall = heaps.every(h => h <= 1)

  if (allSmall) {
    // In misère, if odd heaps of 1 remain, take one (leave even). If even, take one (leave odd — opponent takes last).
    // We want to leave an ODD number of heaps with 1 stone.
    const onesCount = heaps.filter(h => h === 1).length
    if (onesCount % 2 === 0) {
      // Leave odd number — take 1 from any heap with 1
      const idx = heaps.findIndex(h => h === 1)
      return { heap: idx, count: 1 }
    } else {
      // Already odd — any move loses, just take 1
      const idx = heaps.findIndex(h => h === 1)
      return { heap: idx, count: 1 }
    }
  }

  if (nimSum > 0) {
    // Winning position — find the optimal move
    for (let i = 0; i < heaps.length; i++) {
      const target = heaps[i] ^ nimSum
      if (target < heaps[i]) {
        const remove = heaps[i] - target

        // Misère adjustment: if this move would leave all heaps ≤ 1,
        // check if we want odd or even number of 1-heaps
        const newHeaps = [...heaps]
        newHeaps[i] -= remove
        const allWouldBeSmall = newHeaps.every(h => h <= 1)
        if (allWouldBeSmall) {
          const onesLeft = newHeaps.filter(h => h === 1).length
          // In misère, we want to leave ODD number of 1-heaps
          if (onesLeft % 2 === 0 && heaps[i] - remove + 1 <= heaps[i]) {
            // Adjust: leave one more or one less
            return { heap: i, count: remove - 1 > 0 ? remove - 1 : remove }
          }
        }

        return { heap: i, count: remove }
      }
    }
  }

  // Losing position (nim-sum = 0) — take 1 from the largest heap
  let maxIdx = 0
  for (let i = 1; i < heaps.length; i++) {
    if (heaps[i] > heaps[maxIdx]) maxIdx = i
  }
  return { heap: maxIdx, count: 1 }
}
