import { wordSet, prefixSet } from './deriver'

/**
 * Ghost AI: picks the best letter to add, or challenges if no good move exists.
 *
 * Strategy:
 * 1. Find all letters that extend the fragment to a valid prefix
 * 2. Filter out letters that would complete a 4+ letter word (instant loss)
 * 3. Among safe letters, prefer those that force the opponent into even-length
 *    remaining paths (so the opponent is more likely to complete the word)
 * 4. If no safe letter exists, challenge (hope the fragment isn't a valid prefix)
 */
export function getBestGhostMove(
  fragment: string
): { ghostLetter: string } | { ghostChallenge: true } {
  const validLetters: string[] = []

  for (let c = 97; c <= 122; c++) {
    const letter = String.fromCharCode(c)
    const extended = fragment + letter
    if (prefixSet.has(extended)) {
      validLetters.push(letter)
    }
  }

  if (validLetters.length === 0) {
    // No valid prefix extensions — challenge the previous player
    return { ghostChallenge: true }
  }

  // Separate letters into safe (don't complete a word) and dangerous (complete a word)
  const safe: string[] = []
  const dangerous: string[] = []

  for (const letter of validLetters) {
    const extended = fragment + letter
    if (extended.length >= 4 && wordSet.has(extended)) {
      dangerous.push(letter)
    } else {
      safe.push(letter)
    }
  }

  if (safe.length === 0) {
    // Every extension completes a word — challenge instead
    return { ghostChallenge: true }
  }

  // Score safe letters: prefer letters that lead to the opponent completing a word
  // We estimate by finding the shortest word reachable from fragment+letter
  // and checking if the remaining path length is odd (opponent finishes) or even (we finish)
  let bestLetter = safe[0]
  let bestScore = -Infinity

  for (const letter of safe) {
    const extended = fragment + letter
    const score = scoreLetter(extended)
    if (score > bestScore) {
      bestScore = score
      bestLetter = letter
    }
  }

  return { ghostLetter: bestLetter }
}

/**
 * Score a fragment: higher is better for the current player.
 * Looks at shortest completable word from this fragment.
 * Odd remaining letters = opponent completes it (good for us).
 * Also prefers fragments with fewer total valid continuations (constrains opponent).
 */
function scoreLetter(fragment: string): number {
  let minOddDistance = Infinity
  let minEvenDistance = Infinity
  let continuations = 0

  // BFS-like: check all words that start with this fragment
  // For efficiency, just scan the word set (it's small ~500 words)
  for (const word of wordSet) {
    if (word.length >= 4 && word.startsWith(fragment)) {
      const remaining = word.length - fragment.length
      continuations++
      if (remaining > 0) {
        if (remaining % 2 === 1) {
          // Odd remaining = opponent will add the completing letter
          minOddDistance = Math.min(minOddDistance, remaining)
        } else {
          minEvenDistance = Math.min(minEvenDistance, remaining)
        }
      }
    }
  }

  // Prefer: opponent completes (odd distance), shorter is more forcing
  let score = 0
  if (minOddDistance < Infinity) {
    score += 100 - minOddDistance // closer odd = better
  }
  if (minEvenDistance < Infinity) {
    score -= 50 - minEvenDistance // closer even = worse for us
  }
  // Fewer continuations = more constrained for opponent
  score -= continuations

  return score
}
