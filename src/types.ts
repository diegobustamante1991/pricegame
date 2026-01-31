export type GameMode = 'daily' | 'random'

export type Clue =
  | { type: 'image' }
  | {
      type: 'text'
      value: string
    }

export type Product = {
  id: string
  price: number
  image: string
  clues: Clue[]
  title: string
  category: string
  brand: string
  /** Amazon ASIN for live price fetching (optional) */
  asin?: string
}

export type Warmth =
  | 'ice'
  | 'cold'
  | 'warm'
  | 'hot'
  | 'scorching'
  | 'correct'

export type GuessResult = {
  guess: number
  direction: 'higher' | 'lower' | 'correct'
  warmth: Warmth
  percentError: number
  withinTolerance: boolean
}

export type PersistedStateV1 = {
  v: 1
  mode: GameMode
  /** YYYY-MM-DD (local time) */
  dayKey: string
  productId: string
  guesses: GuessResult[]
  revealedClues: number
  finished: boolean
  won: boolean
  onboardingSeen: boolean
}

export type PersistedStateV2 = {
  v: 2
  mode: GameMode
  /** YYYY-MM-DD (local time) */
  dayKey: string
  productId: string
  /** Amazon ASIN used for live random products (optional) */
  productAsin?: string
  guesses: GuessResult[]
  revealedClues: number
  finished: boolean
  won: boolean
  onboardingSeen: boolean
}

export type PersistedState = PersistedStateV1 | PersistedStateV2
