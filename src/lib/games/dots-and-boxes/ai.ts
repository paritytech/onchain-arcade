

const ALL_EDGES: string[] = []
// Generate all 24 edges
for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) ALL_EDGES.push(`h-${r}-${c}`)
for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) ALL_EDGES.push(`v-${r}-${c}`)

function getBoxSides(row: number, col: number): string[] {
  return [`h-${row}-${col}`, `h-${row + 1}-${col}`, `v-${row}-${col}`, `v-${row}-${col + 1}`]
}

function countSides(lines: Set<string>, row: number, col: number): number {
  return getBoxSides(row, col).filter(e => lines.has(e)).length
}

function wouldCompleteBox(lines: Set<string>, edge: string): boolean {
  const linesWithEdge = new Set(lines)
  linesWithEdge.add(edge)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const sides = getBoxSides(r, c)
      if (!lines.has(edge)) continue // only check boxes involving this edge
      if (sides.includes(edge) && sides.every(s => linesWithEdge.has(s))) return true
    }
  }
  // Check all boxes that include this edge
  const m = edge.match(/^([hv])-(\d+)-(\d+)$/)
  if (!m) return false
  const [, dir, rs, cs] = m
  const row = parseInt(rs), col = parseInt(cs)

  if (dir === 'h') {
    if (row > 0 && getBoxSides(row - 1, col).every(s => linesWithEdge.has(s))) return true
    if (row < 3 && getBoxSides(row, col).every(s => linesWithEdge.has(s))) return true
  } else {
    if (col > 0 && getBoxSides(row, col - 1).every(s => linesWithEdge.has(s))) return true
    if (col < 3 && getBoxSides(row, col).every(s => linesWithEdge.has(s))) return true
  }
  return false
}

function wouldGiveOpponentBox(lines: Set<string>, edge: string): boolean {
  // Would placing this edge create a box with 3 sides (letting opponent complete it next)?
  const linesWithEdge = new Set(lines)
  linesWithEdge.add(edge)
  const m = edge.match(/^([hv])-(\d+)-(\d+)$/)
  if (!m) return false
  const [, dir, rs, cs] = m
  const row = parseInt(rs), col = parseInt(cs)

  const boxesToCheck: [number, number][] = []
  if (dir === 'h') {
    if (row > 0) boxesToCheck.push([row - 1, col])
    if (row < 3) boxesToCheck.push([row, col])
  } else {
    if (col > 0) boxesToCheck.push([row, col - 1])
    if (col < 3) boxesToCheck.push([row, col])
  }

  for (const [br, bc] of boxesToCheck) {
    if (countSides(linesWithEdge, br, bc) === 3) return true
  }
  return false
}

export function getBestEdgeMove(lines: string[]): string {
  const lineSet = new Set(lines)
  const remaining = ALL_EDGES.filter(e => !lineSet.has(e))
  if (remaining.length === 0) return ''

  // Priority 1: Complete a box (greedy capture)
  const completers = remaining.filter(e => wouldCompleteBox(lineSet, e))
  if (completers.length > 0) return completers[0]

  // Priority 2: Safe edges (don't give opponent a box)
  const safe = remaining.filter(e => !wouldGiveOpponentBox(lineSet, e))
  if (safe.length > 0) return safe[Math.floor(Math.random() * safe.length)]

  // Priority 3: All remaining edges are dangerous — pick one at random
  return remaining[Math.floor(Math.random() * remaining.length)]
}
