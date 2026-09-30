import type { GameStatement, GameStatus, GameResult } from '@/types/game'
import type { DerivedEmojiPictionary, EmojiPlayer, EmojiGuess } from '@/types/derived-game'
import { getWordForRound } from './words'

export function deriveEmojiPictionary(gameId: string, stmts: GameStatement[]): DerivedEmojiPictionary | null {
  const relevant = stmts.filter(s => s.gameId === gameId)
  if (relevant.length === 0) return null

  const create = relevant.find(s => s.type === 'create_game')
  if (!create || create.type !== 'create_game') return null

  const maxPlayers = create.maxPlayers ?? 3
  const players: EmojiPlayer[] = [
    { address: create.playerX, name: create.playerXName ?? null, score: 0 },
  ]

  let status: GameStatus = 'waiting'
  let result: GameResult = null
  let moveCount = 0
  let updatedAt = create.timestamp

  // Process joins — accumulate up to maxPlayers
  for (const stmt of relevant) {
    if (stmt.type === 'join_game' && players.length < maxPlayers) {
      // Prevent duplicate joins
      if (players.some(p => p.address === stmt.playerO)) continue
      players.push({
        address: stmt.playerO,
        name: stmt.playerOName ?? null,
        score: 0,
      })
      updatedAt = stmt.timestamp
      if (players.length === maxPlayers) {
        status = 'playing'
      }
    }
  }

  const totalRounds = players.length
  let roundNumber = 0
  let currentDescriber = 0
  let clues: string[] = []
  let guesses: EmojiGuess[] = []
  let wordGuessed = false

  // Process moves
  if (status === 'playing') {
    for (const stmt of relevant) {
      if (stmt.type !== 'make_move') continue
      if (status !== 'playing') continue

      const playerIndex = players.findIndex(p => p.address === stmt.player)
      if (playerIndex === -1) continue

      if (stmt.emojiClue) {
        // Only the current describer can send clues
        if (playerIndex !== currentDescriber) continue
        clues.push(stmt.emojiClue)
        moveCount++
        updatedAt = stmt.timestamp
      } else if (stmt.guess) {
        // Describers can't guess their own word
        if (playerIndex === currentDescriber) continue
        // Check if this player already guessed correctly
        if (guesses.some(g => g.playerIndex === playerIndex && g.correct)) continue

        const currentWord = getWordForRound(gameId, roundNumber)
        const correct = stmt.guess.toLowerCase().trim() === currentWord.toLowerCase()
        guesses.push({ playerIndex, text: stmt.guess, correct })
        moveCount++
        updatedAt = stmt.timestamp

        if (correct && !wordGuessed) {
          wordGuessed = true
          // Score: guesser gets 3 points, describer gets 1
          const correctGuessCount = guesses.filter(g => g.correct).length
          const guesserPoints = Math.max(1, 4 - correctGuessCount) // 3, 2, 1, 1...
          players[playerIndex].score += guesserPoints
          players[currentDescriber].score += 1

          // Advance to next round
          roundNumber++
          currentDescriber = roundNumber % totalRounds
          clues = []
          guesses = []
          wordGuessed = false

          if (roundNumber >= totalRounds) {
            status = 'finished'
            // Determine winner
            const maxScore = Math.max(...players.map(p => p.score))
            const winners = players.filter(p => p.score === maxScore)
            if (winners.length === 1) {
              const winnerIdx = players.indexOf(winners[0])
              result = winnerIdx === 0 ? 'x_wins' : 'o_wins' // simplified for 2+ players
            } else {
              result = 'draw'
            }
          }
        }
      } else if (stmt.skipRound) {
        // Describer can skip the round
        if (playerIndex !== currentDescriber) continue
        moveCount++
        updatedAt = stmt.timestamp

        roundNumber++
        currentDescriber = roundNumber % totalRounds
        clues = []
        guesses = []
        wordGuessed = false

        if (roundNumber >= totalRounds) {
          status = 'finished'
          const maxScore = Math.max(...players.map(p => p.score))
          const winners = players.filter(p => p.score === maxScore)
          if (winners.length === 1) {
            result = winners[0] === players[0] ? 'x_wins' : 'o_wins'
          } else {
            result = 'draw'
          }
        }
      }
    }
  }

  const currentWord = getWordForRound(gameId, roundNumber)

  return {
    id: gameId,
    gameType: 'emoji-pictionary',
    players,
    maxPlayers,
    currentDescriber,
    currentWord,
    clues,
    guesses,
    roundNumber,
    totalRounds,
    wordGuessed,
    // DerivedGameBase fields
    playerX: create.playerX,
    playerXName: create.playerXName ?? null,
    playerO: players.length > 1 ? players[1].address : null,
    playerOName: players.length > 1 ? players[1].name : null,
    currentTurn: 'X', // not used for this game
    status,
    result,
    moveCount,
    vsComputer: false,
    createdAt: create.timestamp,
    updatedAt,
  }
}
