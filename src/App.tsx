import './App.css'
import { useEffect, useMemo, useState } from 'react'
import productsRaw from './data/products.json'
import type { GameMode, GuessResult, PersistedStateV1, Product } from './types'
import { GameHeader } from './components/GameHeader'
import { ProductCard } from './components/ProductCard'
import { ClueStack } from './components/ClueStack'
import { GuessInput } from './components/GuessInput'
import { GuessHistory } from './components/GuessHistory'
import { ResultsModal } from './components/ResultsModal'
import { OnboardingModal } from './components/OnboardingModal'
import { getLocalDayKey } from './utils/date'
import { pickDeterministicIndex } from './utils/random'
import { directionLabel, percentError, toleranceCheck, warmthLabel } from './utils/price'
import { loadLeaderboard, loadState, saveLeaderboard, saveState } from './utils/storage'
import { calculateScore } from './utils/score'

const PRODUCTS = productsRaw as Product[]
const MAX_TRIES = 5

function pickProduct(mode: GameMode, dayKey: string) {
  if (mode === 'daily') {
    const idx = pickDeterministicIndex(dayKey, PRODUCTS.length)
    return PRODUCTS[idx]
  }
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]
}

function buildFreshState(mode: GameMode, dayKey: string, onboardingSeen: boolean): PersistedStateV1 {
  const product = pickProduct(mode, dayKey)
  return {
    v: 1,
    mode,
    dayKey,
    productId: product.id,
    guesses: [],
    revealedClues: 1,
    finished: false,
    won: false,
    onboardingSeen,
  }
}

export default function App() {
  const todayKey = useMemo(() => getLocalDayKey(), [])
  const [state, setState] = useState<PersistedStateV1>(() => {
    const loaded = typeof window !== 'undefined' ? loadState() : null
    const onboardingSeen = loaded?.onboardingSeen ?? false

    if (loaded && loaded.v === 1) {
      // Daily mode: reset when the day changes
      if (loaded.mode === 'daily' && loaded.dayKey !== todayKey) {
        return buildFreshState('daily', todayKey, onboardingSeen)
      }
      // Ensure product exists; otherwise reset
      const exists = PRODUCTS.some((p) => p.id === loaded.productId)
      if (exists) return loaded
    }
    return buildFreshState('daily', todayKey, onboardingSeen)
  })

  const [showResults, setShowResults] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    if (state.finished) setShowResults(true)
  }, [state.finished])

  useEffect(() => {
    if (!state.finished || !state.won) return
    // push into local leaderboard (top 3 displayed), de-dupe by round signature
    const sig = `pp:${state.mode}:${state.dayKey}:${state.productId}:${state.guesses.length}`
    try {
      const lastSig = localStorage.getItem('pricepeek:lastWinSig')
      if (lastSig === sig) return
      const score = calculateScore(state.guesses, true)
      const entries = loadLeaderboard()
      entries.push({
        score,
        tries: state.guesses.length,
        mode: state.mode,
        dayKey: state.dayKey,
        at: Date.now(),
      })
      saveLeaderboard(entries)
      localStorage.setItem('pricepeek:lastWinSig', sig)
    } catch {
      // ignore
    }
  }, [state.finished, state.won, state.mode, state.dayKey, state.productId, state.guesses])

  const product = useMemo(() => {
    const p = PRODUCTS.find((x) => x.id === state.productId)
    return p ?? PRODUCTS[0]
  }, [state.productId])

  const triesUsed = state.guesses.length
  const triesLeft = Math.max(0, MAX_TRIES - triesUsed)

  function startNew(mode: GameMode) {
    setShowResults(false)
    setState((prev) => buildFreshState(mode, todayKey, prev.onboardingSeen))
  }

  function startDemo() {
    const demo = PRODUCTS.find((p) => p.id === 'demo-realimg-insulated-bottle')
    if (!demo) return
    setShowResults(false)
    setState((prev) => ({
      ...prev,
      mode: 'random',
      dayKey: todayKey,
      productId: demo.id,
      guesses: [],
      revealedClues: 1,
      finished: false,
      won: false,
    }))
  }

  function onGuess(value: number) {
    setState((prev) => {
      if (prev.finished) return prev
      const actual = product.price
      const within = toleranceCheck(value, actual)
      const pErr = percentError(value, actual)
      const warmth = warmthLabel(pErr, within)
      const dir = within ? ('correct' as const) : directionLabel(value, actual)
      const nextGuess: GuessResult = {
        guess: value,
        direction: dir,
        warmth,
        percentError: pErr,
        withinTolerance: within,
      }

      const guesses = [...prev.guesses, nextGuess]
      const won = within
      const finished = won || guesses.length >= MAX_TRIES
      const revealedClues = finished
        ? MAX_TRIES
        : Math.min(MAX_TRIES, prev.revealedClues + 1)

      return {
        ...prev,
        guesses,
        revealedClues,
        finished,
        won,
      }
    })
  }

  function closeHelp() {
    setShowHelp(false)
    setState((prev) => ({ ...prev, onboardingSeen: true }))
  }

  const showOnboarding = !state.onboardingSeen
  const canGuess = !state.finished && triesLeft > 0

  return (
    <div className="appShell">
      <GameHeader
        mode={state.mode}
        dayKey={todayKey}
        onModeChange={(m) => startNew(m)}
        onNewRandom={() => startNew('random')}
        onDemo={startDemo}
        onOpenHelp={() => setShowHelp(true)}
      />

      <main className="main">
        <div className="centerCard">
          <div className="triesRow" aria-label={`Remaining tries: ${triesLeft}`}>
            {Array.from({ length: MAX_TRIES }).map((_, i) => (
              <div key={i} className={`tryDot ${i < triesUsed ? 'filled' : ''}`} />
            ))}
          </div>

          <ProductCard product={product} />

          <ClueStack clues={product.clues} revealed={state.revealedClues} />

          <div className="feedbackRow">
            {state.guesses.length > 0 ? (
              <div className="feedbackPill">
                <span className="feedbackLabel">Last:</span>
                <span className="feedbackValue">
                  {state.guesses[state.guesses.length - 1].direction === 'correct'
                    ? 'Correct'
                    : state.guesses[state.guesses.length - 1].direction === 'higher'
                      ? 'Higher'
                      : 'Lower'}
                </span>
                <span className="feedbackDot" aria-hidden="true">
                  •
                </span>
                <span className="feedbackWarmth">
                  {state.guesses[state.guesses.length - 1].warmth === 'correct'
                    ? '🎯'
                    : state.guesses[state.guesses.length - 1].warmth === 'ice'
                      ? 'Ice Cold'
                      : state.guesses[state.guesses.length - 1].warmth === 'cold'
                        ? 'Cold'
                        : state.guesses[state.guesses.length - 1].warmth === 'warm'
                          ? 'Warm'
                          : state.guesses[state.guesses.length - 1].warmth === 'hot'
                            ? 'Hot'
                            : 'Scorching'}
                </span>
              </div>
            ) : (
              <div className="feedbackHint">Make a guess to unlock clues.</div>
            )}
          </div>

          <GuessInput disabled={!canGuess} onSubmit={onGuess} />

          <GuessHistory guesses={state.guesses} />
        </div>
      </main>

      <ResultsModal
        open={showResults}
        mode={state.mode}
        dayKey={todayKey}
        product={product}
        guesses={state.guesses}
        won={state.won}
        onClose={() => setShowResults(false)}
      />

      <OnboardingModal open={showOnboarding || showHelp} onClose={closeHelp} />
    </div>
  )
}
