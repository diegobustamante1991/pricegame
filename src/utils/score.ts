import type { GuessResult } from '../types'

export function calculateScore(guesses: GuessResult[], won: boolean) {
  if (!won) return 0
  const triesUsed = guesses.length
  const base = Math.max(0, 600 - (triesUsed - 1) * 100) // 600..200
  const last = guesses[guesses.length - 1]
  const accuracyBonus = last ? Math.round(Math.max(0, 200 * (1 - Math.min(1, last.percentError)))) : 0
  return base + accuracyBonus
}

export function buildEmojiGrid(guesses: GuessResult[], totalTries = 5) {
  const cells = guesses.map((g) => g.warmth)
  while (cells.length < totalTries) cells.push('ice')
  return cells
}

