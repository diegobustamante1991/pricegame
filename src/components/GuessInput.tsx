import { useEffect, useMemo, useState } from 'react'
import type { GuessResult } from '../types'
import { warmthEmoji } from '../utils/price'

type Props = {
  disabled?: boolean
  onSubmit: (value: number) => void
  guesses: GuessResult[]
  max?: number
  resetKey?: string
}

const MIN_PRICE = 1
const DEFAULT_MAX = 300
const STEP = 0.5

export function GuessInput({ disabled, onSubmit, guesses, max = DEFAULT_MAX, resetKey }: Props) {
  const lastGuess = guesses[guesses.length - 1]?.guess
  const initialValue = useMemo(() => {
    const fallback = Number.isFinite(lastGuess) ? Number(lastGuess) : 50
    return Math.min(Math.max(fallback, MIN_PRICE), max)
  }, [lastGuess, max])

  const [value, setValue] = useState(initialValue)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (!shake) return
    const t = window.setTimeout(() => setShake(false), 520)
    return () => window.clearTimeout(t)
  }, [shake])

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue, resetKey])

  function submit() {
    if (disabled) return
    if (!Number.isFinite(value) || value <= 0) {
      setShake(true)
      return
    }
    onSubmit(Math.round(value * 100) / 100)
  }

  return (
    <div className={`guessRow ${shake ? 'shake' : ''}`}>
      <div className="sliderCard">
        <div className="sliderHeader">
          <span className="sliderValue">${value.toFixed(2)}</span>
          <span className="sliderRange">
            ${MIN_PRICE}–${max}
          </span>
        </div>
        <div className="sliderTrack">
          <input
            type="range"
            className="priceSlider"
            min={MIN_PRICE}
            max={max}
            step={STEP}
            value={value}
            disabled={disabled}
            aria-label="Set a price in dollars"
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <div className="sliderMarkers" aria-hidden="true">
            {guesses.map((guess, idx) => {
              const ratio = (guess.guess - MIN_PRICE) / (max - MIN_PRICE)
              const left = Math.min(100, Math.max(0, ratio * 100))
              return (
                <span key={`${idx}-${guess.guess}`} className="sliderMarker" style={{ left: `${left}%` }}>
                  {warmthEmoji(guess.warmth)}
                </span>
              )
            })}
          </div>
        </div>
      </div>
      <button type="button" className="primaryBtn" onClick={submit} disabled={disabled}>
        Guess
      </button>
    </div>
  )
}

