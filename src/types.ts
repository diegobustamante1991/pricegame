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
