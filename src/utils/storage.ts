import type { PersistedStateV1 } from '../types'

const KEY = 'pricepeek:v1'
const LEADERBOARD_KEY = 'pricepeek:leaderboard:v1'

export type LeaderboardEntry = {
  score: number
  tries: number
  mode: 'daily' | 'random'
  dayKey: string
  at: number
}

export function loadState(): PersistedStateV1 | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedStateV1
    if (!parsed || parsed.v !== 1) return null
    return parsed
  } catch {
    return null
  }
}

export function saveState(state: PersistedStateV1) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
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

