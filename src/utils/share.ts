import type { GuessResult } from '../types'
import { APP, SHARE_CONFIG } from '../content'

const DAY_MS = 24 * 60 * 60 * 1000
const DAY_ONE = Date.UTC(2024, 0, 1)

export function getDayNumber(dayKey: string) {
  const [y, m, d] = dayKey.split('-').map((v) => Number(v))
  if (!y || !m || !d) return 0
  const utc = Date.UTC(y, m - 1, d)
  if (!Number.isFinite(utc)) return 0
  return Math.max(1, Math.floor((utc - DAY_ONE) / DAY_MS) + 1)
}

function distanceEmoji(percentError: number) {
  if (percentError <= SHARE_CONFIG.thresholds.close) return SHARE_CONFIG.emojis.close
  if (percentError <= SHARE_CONFIG.thresholds.medium) return SHARE_CONFIG.emojis.medium
  return SHARE_CONFIG.emojis.far
}

function directionEmoji(direction: GuessResult['direction']) {
  if (direction === 'higher') return SHARE_CONFIG.emojis.tooLow
  if (direction === 'lower') return SHARE_CONFIG.emojis.tooHigh
  return SHARE_CONFIG.emojis.correct
}

export function buildShareGrid(guesses: GuessResult[]) {
  return guesses.slice(0, SHARE_CONFIG.maxTries).map((guess) => {
    if (guess.withinTolerance || guess.direction === 'correct') {
      return SHARE_CONFIG.emojis.correct.repeat(3)
    }
    const dir = directionEmoji(guess.direction)
    const dist = distanceEmoji(guess.percentError)
    return `${dir}${dist}${SHARE_CONFIG.emojis.locked}`
  })
}

export function buildShareText(dayKey: string, guesses: GuessResult[]) {
  const dayNumber = getDayNumber(dayKey)
  const header = `${APP.name} #${dayNumber} ${Math.min(guesses.length, SHARE_CONFIG.maxTries)}/${SHARE_CONFIG.maxTries}`
  const grid = buildShareGrid(guesses).join('\n')
  return `${header}\n${grid}`
}
