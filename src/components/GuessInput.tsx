import { useEffect, useMemo, useState } from 'react'
import type { GuessResult } from '../types'
import { warmthEmoji } from '../utils/price'
import { BUTTONS, LABELS, STATES } from '../content'

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
  const [rawInput, setRawInput] = useState(initialValue.toFixed(2))
  const [shake, setShake] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!shake) return
    const t = window.setTimeout(() => setShake(false), 520)
    return () => window.clearTimeout(t)
  }, [shake])

  useEffect(() => {
    setValue(initialValue)
    setRawInput(initialValue.toFixed(2))
    setError('')
  }, [initialValue, resetKey])

  function submit() {
    if (disabled) return
    if (!Number.isFinite(value) || value <= 0) {
      setShake(true)
      setError(STATES.invalid)
      return
    }
    onSubmit(Math.round(value * 100) / 100)
    setError('')
  }

  function syncFromInput(nextRaw: string) {
    setRawInput(nextRaw)
    const numeric = Number(nextRaw)
    if (!Number.isFinite(numeric)) return
    const clamped = Math.min(Math.max(numeric, MIN_PRICE), max)
    setValue(clamped)
  }

  return (
    <div className={`guessRow ${shake ? 'shake' : ''}`}>
      <div className="sliderCard">
        <div className="sliderHeader">
          <span className="sliderRange">
            ${MIN_PRICE}–${max}
          </span>
          <label className="sliderInputWrap">
            <span className="sliderInputPrefix">$</span>
            <input
              type="number"
              className="sliderInput"
              inputMode="decimal"
              min={MIN_PRICE}
              max={max}
              step={STEP}
              value={rawInput}
              disabled={disabled}
              aria-label={LABELS.guessAria}
              onChange={(e) => {
                syncFromInput(e.target.value)
                if (error) setError('')
              }}
              onBlur={() => setRawInput(value.toFixed(2))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
            />
          </label>
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
            aria-label={LABELS.guessAria}
            onChange={(e) => {
              const next = Number(e.target.value)
              setValue(next)
              setRawInput(next.toFixed(2))
              if (error) setError('')
            }}
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
        {error ? <div className="inputError">{error}</div> : null}
      </div>
      <button type="button" className="primaryBtn" onClick={submit} disabled={disabled}>
        {BUTTONS.guess}
      </button>
    </div>
  )
}

