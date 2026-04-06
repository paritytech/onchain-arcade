import type { HackenbushEdge, HackenbushNode } from '@/types/derived-game'

/**
 * BFS from ground nodes to find all reachable node IDs through alive edges.
 */
function findConnected(groundNodes: number[], edges: HackenbushEdge[]): Set<number> {
  const aliveEdges = edges.filter(e => e.alive)
  const adj = new Map<number, number[]>()
  for (const e of aliveEdges) {
    if (!adj.has(e.from)) adj.set(e.from, [])
    if (!adj.has(e.to)) adj.set(e.to, [])
    adj.get(e.from)!.push(e.to)
    adj.get(e.to)!.push(e.from)
  }

  const visited = new Set<number>()
  const queue = [...groundNodes]
  for (const g of queue) visited.add(g)

  while (queue.length > 0) {
    const node = queue.shift()!
    for (const neighbor of adj.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }
  return visited
}

/**
 * Simulate removing an edge and cascade, returning the resulting alive edges.
 */
function simulateRemoval(
  edgeId: number,
  edges: HackenbushEdge[],
  groundNodes: number[],
): HackenbushEdge[] {
  const copy = edges.map(e => ({ ...e }))
  const target = copy.find(e => e.id === edgeId)
  if (target) target.alive = false

  // Cascade: remove edges where either endpoint is disconnected from ground
  const connected = findConnected(groundNodes, copy)
  for (const e of copy) {
    if (e.alive && (!connected.has(e.from) || !connected.has(e.to))) {
      e.alive = false
    }
  }
  return copy
}

/**
 * Compute minimum BFS distance from a node to any ground node through alive edges.
 */
function distanceToGround(
  nodeId: number,
  groundNodes: number[],
  edges: HackenbushEdge[],
): number {
  const aliveEdges = edges.filter(e => e.alive)
  const adj = new Map<number, number[]>()
  for (const e of aliveEdges) {
    if (!adj.has(e.from)) adj.set(e.from, [])
    if (!adj.has(e.to)) adj.set(e.to, [])
    adj.get(e.from)!.push(e.to)
    adj.get(e.to)!.push(e.from)
  }

  const groundSet = new Set(groundNodes)
  if (groundSet.has(nodeId)) return 0

  const visited = new Set<number>([nodeId])
  const queue: [number, number][] = [[nodeId, 0]]

  while (queue.length > 0) {
    const [current, dist] = queue.shift()!
    for (const neighbor of adj.get(current) ?? []) {
      if (groundSet.has(neighbor)) return dist + 1
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([neighbor, dist + 1])
      }
    }
  }
  return Infinity
}

/**
 * Greedy Hackenbush AI.
 *
 * Strategy:
 * 1. For each alive edge of the computer's color, simulate removal + cascade.
 * 2. Score = number of opponent edges that would also be removed (cascade damage).
 * 3. Pick the edge causing most opponent cascade damage.
 * 4. Tiebreak: prefer edges closer to ground (harder for opponent to recover from).
 */
export function getBestHackenbushMove(
  edges: HackenbushEdge[],
  _nodes: HackenbushNode[],
  groundNodes: number[],
  playerColor: 'R' | 'B',
): number {
  const opponentColor = playerColor === 'R' ? 'B' : 'R'
  const candidates = edges.filter(e => e.alive && e.color === playerColor)

  if (candidates.length === 0) return -1

  const opponentAliveCount = edges.filter(e => e.alive && e.color === opponentColor).length

  let bestEdgeId = candidates[0].id
  let bestScore = -Infinity
  let bestGroundDist = Infinity

  for (const candidate of candidates) {
    const afterRemoval = simulateRemoval(candidate.id, edges, groundNodes)
    const opponentRemaining = afterRemoval.filter(e => e.alive && e.color === opponentColor).length
    const cascadeDamage = opponentAliveCount - opponentRemaining

    // Distance of the edge's lower endpoint to ground (use min of both endpoints)
    const distFrom = distanceToGround(candidate.from, groundNodes, edges)
    const distTo = distanceToGround(candidate.to, groundNodes, edges)
    const groundDist = Math.min(distFrom, distTo)

    if (
      cascadeDamage > bestScore ||
      (cascadeDamage === bestScore && groundDist < bestGroundDist)
    ) {
      bestScore = cascadeDamage
      bestGroundDist = groundDist
      bestEdgeId = candidate.id
    }
  }

  return bestEdgeId
}
