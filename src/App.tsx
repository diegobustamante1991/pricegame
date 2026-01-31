import './App.css'
import { useEffect, useMemo, useState } from 'react'
import productsRaw from './data/products.json'
import type { GameMode, GuessResult, PersistedStateV2, Product } from './types'
import { fetchProductByAsin } from './api/product'
import { REAL_ASIN_POOL } from './data/realAsins'
import { GameHeader } from './components/GameHeader'
import { ProductCard } from './components/ProductCard'
import { ClueStack } from './components/ClueStack'
import { GuessInput } from './components/GuessInput'
import { GuessHistory } from './components/GuessHistory'
import { ResultsModal } from './components/ResultsModal'
import { OnboardingModal } from './components/OnboardingModal'
import { getLocalDayKey } from './utils/date'
import { pickDeterministicIndex } from './utils/random'
import { directionLabel, percentError, toleranceCheck, warmthEmoji, warmthLabel, warmthText } from './utils/price'
import { loadLeaderboard, loadState, saveLeaderboard, saveState } from './utils/storage'
import { calculateScore } from './utils/score'
import { buildLiveClues, buildLiveProduct } from './utils/liveProduct'
import { LABELS, STATES } from './content'

const PRODUCTS = productsRaw as Product[]
const MAX_TRIES = 5
const LIVE_PRICE_FETCH_MS = 3000
const LIVE_RANDOM_ENABLED = Boolean(import.meta.env.VITE_API_URL)

function pickStaticProduct(mode: GameMode, dayKey: string) {
  if (mode === 'daily') {
    const idx = pickDeterministicIndex(dayKey, PRODUCTS.length)
    return PRODUCTS[idx]
  }
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]
}

function pickRandomAsin() {
  return REAL_ASIN_POOL[Math.floor(Math.random() * REAL_ASIN_POOL.length)]
}

function buildFreshState(mode: GameMode, dayKey: string, onboardingSeen: boolean): PersistedStateV2 {
  if (mode === 'random' && LIVE_RANDOM_ENABLED) {
    const asin = pickRandomAsin()
    return {
      v: 2,
      mode,
      dayKey,
      productId: `live:${asin}`,
      productAsin: asin,
      guesses: [],
      revealedClues: 1,
      finished: false,
      won: false,
      onboardingSeen,
    }
  }
  const product = pickStaticProduct(mode, dayKey)
  return {
    v: 2,
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
  const [state, setState] = useState<PersistedStateV2>(() => {
    const loaded = typeof window !== 'undefined' ? loadState() : null
    const onboardingSeen = loaded?.onboardingSeen ?? false

    if (loaded && loaded.v === 2) {
      // Daily mode: reset when the day changes
      if (loaded.mode === 'daily' && loaded.dayKey !== todayKey) {
        return buildFreshState('daily', todayKey, onboardingSeen)
      }
      if (loaded.productAsin) return loaded
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
    const sig = `pk:${state.mode}:${state.dayKey}:${state.productId}:${state.guesses.length}`
    try {
      const lastSig = localStorage.getItem('peekle:lastWinSig')
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
      localStorage.setItem('peekle:lastWinSig', sig)
    } catch {
      // ignore
    }
  }, [state.finished, state.won, state.mode, state.dayKey, state.productId, state.guesses])

  const baseProduct = useMemo(() => {
    if (state.productAsin) return buildLiveProduct(state.productAsin)
    const p = PRODUCTS.find((x) => x.id === state.productId)
    return p ?? PRODUCTS[0]
  }, [state.productId, state.productAsin])

  const [product, setProduct] = useState<Product>(baseProduct)
  const [priceLoading, setPriceLoading] = useState(false)

  useEffect(() => {
    const productId = baseProduct.id
    setProduct(baseProduct)
    if (!baseProduct.asin) {
      setPriceLoading(false)
      return
    }
    setPriceLoading(true)
    let cancelled = false
    const t = setTimeout(() => {
      if (!cancelled) setPriceLoading(false)
    }, LIVE_PRICE_FETCH_MS)
    fetchProductByAsin(baseProduct.asin)
      .then((live) => {
        if (!cancelled && live && live.price > 0) {
          setProduct((prev) =>
            prev.id === productId
              ? {
                  ...prev,
                  price: live.price,
                  image: live.image || prev.image,
                  title: live.title || prev.title,
                  brand: live.brand || prev.brand,
                  category: live.category || prev.category,
                  clues: buildLiveClues(live),
                }
              : prev
          )
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPriceLoading(false)
      })
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [baseProduct.id, baseProduct.asin])

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
      productAsin: undefined,
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
  const canGuess = !state.finished && triesLeft > 0 && !priceLoading

  return (
    <div className="appShell">
      <GameHeader
        mode={state.mode}
        onModeChange={(m) => startNew(m)}
        onNewRandom={() => startNew('random')}
        onDemo={startDemo}
        onOpenHelp={() => setShowHelp(true)}
      />

      <main className="main">
        <div className="centerCard">
          <div className="triesRow" aria-label={LABELS.remainingTries(triesLeft)}>
            {Array.from({ length: MAX_TRIES }).map((_, i) => (
              <div key={i} className={`tryDot ${i < triesUsed ? 'filled' : ''}`} />
            ))}
          </div>

          <div className="productLayout">
            <div className="productPane">
              <ProductCard product={product} />
              {priceLoading && (
                <div className="priceLoadingHint" role="status">
                  {STATES.loading}
                </div>
              )}
            </div>
            <div className="cluePane">
              <ClueStack clues={product.clues} revealed={state.revealedClues} />
            </div>
          </div>

          <div className="feedbackRow">
            {state.guesses.length > 0 ? (
              <div className="feedbackPill">
                <span className="feedbackLabel">{LABELS.last}:</span>
                <span className="feedbackValue">
                  {state.guesses[state.guesses.length - 1].direction === 'correct'
                    ? STATES.win
                    : state.guesses[state.guesses.length - 1].direction === 'higher'
                      ? STATES.tooLow
                      : STATES.tooHigh}
                </span>
                <span className="feedbackDot" aria-hidden="true">
                  •
                </span>
                <span className="feedbackWarmth">
                  {warmthEmoji(state.guesses[state.guesses.length - 1].warmth)}{' '}
                  {warmthText(state.guesses[state.guesses.length - 1].warmth)}
                </span>
              </div>
            ) : (
              <div className="feedbackHint">{LABELS.feedbackHint}</div>
            )}
          </div>

          <GuessInput
            disabled={!canGuess}
            onSubmit={onGuess}
            guesses={state.guesses}
            resetKey={product.id}
            max={300}
          />

          <GuessHistory guesses={state.guesses} />
        </div>
      </main>

      <ResultsModal
        open={showResults}
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
