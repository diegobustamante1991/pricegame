import type { GuessResult } from '../types'
import { warmthEmoji, warmthText } from '../utils/price'

type Props = {
  guesses: GuessResult[]
}

export function GuessHistory({ guesses }: Props) {
  if (guesses.length === 0) {
    return (
      <div className="historyEmpty">
        Your guesses will show up here.
      </div>
    )
  }

  return (
    <div className="history" aria-label="Guess history">
      {guesses.map((g, idx) => (
        <div key={idx} className={`guessChip warmth-${g.warmth}`}>
          <div className="chipTop">
            <span className="chipGuess">${g.guess.toFixed(2)}</span>
            <span className="chipDir">{g.direction === 'correct' ? '✓' : g.direction === 'higher' ? 'Higher' : 'Lower'}</span>
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

