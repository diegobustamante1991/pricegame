import type { PersistedState, PersistedStateV1, PersistedStateV2 } from '../types'

const KEY_V1 = 'peekle:v1'
const KEY_V2 = 'peekle:v2'
const LEADERBOARD_KEY = 'peekle:leaderboard:v1'

export type LeaderboardEntry = {
  score: number
  tries: number
  mode: 'daily' | 'random'
  dayKey: string
  at: number
}

export function loadState(): PersistedStateV2 | null {
  try {
    const rawV2 = localStorage.getItem(KEY_V2)
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as PersistedState
      if (parsed && parsed.v === 2) return parsed
    }
    const rawV1 = localStorage.getItem(KEY_V1)
    if (!rawV1) return null
    const parsedV1 = JSON.parse(rawV1) as PersistedStateV1
    if (!parsedV1 || parsedV1.v !== 1) return null
    return {
      v: 2,
      mode: parsedV1.mode,
      dayKey: parsedV1.dayKey,
      productId: parsedV1.productId,
      guesses: parsedV1.guesses,
      revealedClues: parsedV1.revealedClues,
      finished: parsedV1.finished,
      won: parsedV1.won,
      onboardingSeen: parsedV1.onboardingSeen,
    }
  } catch {
    return null
  }
}

export function saveState(state: PersistedStateV2) {
  try {
    localStorage.setItem(KEY_V2, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY_V2)
  } catch {
    // ignore
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LeaderboardEntry[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((x) => x && Number.isFinite(x.score) && Number.isFinite(x.tries) && typeof x.at === 'number')
      .slice(0, 50)
  } catch {
    return []
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries.slice(0, 50)))
  } catch {
    // ignore
  }
}

