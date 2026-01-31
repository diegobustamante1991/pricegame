import type { GuessResult } from '../types'
import { warmthEmoji, warmthText } from '../utils/price'
import { LABELS, STATES } from '../content'

type Props = {
  guesses: GuessResult[]
}

export function GuessHistory({ guesses }: Props) {
  if (guesses.length === 0) {
    return (
      <div className="historyEmpty">
        {LABELS.historyEmpty}
      </div>
    )
  }

  return (
    <div className="history" aria-label={LABELS.historyLabel}>
      {guesses.map((g, idx) => (
        <div key={idx} className={`guessChip warmth-${g.warmth}`}>
          <div className="chipTop">
            <span className="chipGuess">${g.guess.toFixed(2)}</span>
            <span className="chipDir">
              {g.direction === 'correct' ? '✓' : g.direction === 'higher' ? STATES.tooLow : STATES.tooHigh}
            </span>
          </div>
          <div className="chipSub">
            <span className="chipEmoji" aria-hidden="true">
              {warmthEmoji(g.warmth)}
            </span>{' '}
            {warmthText(g.warmth)}
          </div>
        </div>
      ))}
    </div>
  )
}

