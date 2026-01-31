import type { Warmth } from '../types'
import { WARMTH } from '../content'

export const DEFAULT_TOLERANCE_PERCENT = 0.03
export const MIN_TOLERANCE_DOLLARS = 1

export function percentError(guess: number, actual: number) {
  if (!Number.isFinite(guess) || !Number.isFinite(actual) || actual === 0) return Infinity
  return Math.abs(guess - actual) / Math.abs(actual)
}

export function toleranceCheck(
  guess: number,
  actual: number,
  tolerancePercent = DEFAULT_TOLERANCE_PERCENT,
  minToleranceDollars = MIN_TOLERANCE_DOLLARS,
) {
  const tol = Math.max(Math.abs(actual) * tolerancePercent, minToleranceDollars)
  return Math.abs(guess - actual) <= tol
}

export function warmthLabel(pErr: number, withinTolerance: boolean): Warmth {
  if (withinTolerance) return 'correct'
  if (!Number.isFinite(pErr)) return 'ice'
  if (pErr >= 1.0) return 'ice'
  if (pErr >= 0.5) return 'cold'
  if (pErr >= 0.2) return 'warm'
  if (pErr >= 0.1) return 'hot'
  return 'scorching'
}

export function warmthText(w: Warmth) {
  return WARMTH.text[w]
}

export function warmthEmoji(w: Warmth) {
  return WARMTH.emoji[w]
}

export function directionLabel(guess: number, actual: number) {
  if (guess === actual) return 'correct' as const
  return guess < actual ? ('higher' as const) : ('lower' as const)
}

export function clampMoney(n: number) {
  // keep cents, prevent silly negatives
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.round(n * 100) / 100)
}

