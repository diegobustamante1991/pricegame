import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  disabled?: boolean
  onSubmit: (value: number) => void
}

function parseMoney(raw: string) {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  if (!cleaned) return NaN
  const n = Number(cleaned)
  if (!Number.isFinite(n)) return NaN
  return Math.round(n * 100) / 100
}

export function GuessInput({ disabled, onSubmit }: Props) {
  const [raw, setRaw] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!shake) return
    const t = window.setTimeout(() => setShake(false), 520)
    return () => window.clearTimeout(t)
  }, [shake])

  const parsed = useMemo(() => parseMoney(raw), [raw])

  function submit() {
    if (disabled) return
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setShake(true)
      inputRef.current?.focus()
      return
    }
    onSubmit(parsed)
    setRaw('')
    inputRef.current?.focus()
  }

  return (
    <div className={`guessRow ${shake ? 'shake' : ''}`}>
      <div className="moneyInput">
        <span className="moneyPrefix" aria-hidden="true">
          $
        </span>
        <input
          ref={inputRef}
          className="moneyField"
          inputMode="decimal"
          placeholder="Enter a price…"
          value={raw}
          disabled={disabled}
          aria-label="Enter a price in dollars"
          onChange={(e) => setRaw(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </div>
      <button type="button" className="primaryBtn" onClick={submit} disabled={disabled}>
        Guess
      </button>
    </div>
  )
}

