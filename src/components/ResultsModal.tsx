import type { GameMode, GuessResult, Product } from '../types'
import { calculateScore } from '../utils/score'
import { warmthEmoji } from '../utils/price'
import { Confetti } from './Confetti'
import { loadLeaderboard, type LeaderboardEntry } from '../utils/storage'

type Props = {
  open: boolean
  mode: GameMode
  dayKey: string
  product: Product
  guesses: GuessResult[]
  won: boolean
  onClose: () => void
}

function buildShareText(mode: GameMode, dayKey: string, guesses: GuessResult[], won: boolean, price: number) {
  const header = `PricePeek ${mode === 'daily' ? `Daily ${dayKey}` : 'Random'} • ${won ? guesses.length : 'X'}/5`
  const grid = guesses.map((g) => warmthEmoji(g.warmth)).join('')
  const reveal = won ? '' : `\nPrice was $${price.toFixed(2)}`
  return `${header}\n${grid}${reveal}\nplay again tomorrow (or hit Random)`
}

export function ResultsModal({ open, mode, dayKey, product, guesses, won, onClose }: Props) {
  if (!open) return null
  const score = calculateScore(guesses, won)
  const leaderboard = loadLeaderboard()
    .slice()
    .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
    .slice(0, 3)
  const shareText = buildShareText(mode, dayKey, guesses, won, product.price)

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText)
    } catch {
      // ignore
    }
  }

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Results">
      <div className="modal">
        <Confetti active={won} />
        <div className="modalHeader">
          <div className="modalTitle">{won ? 'You nailed it' : 'Nice try'}</div>
          <button type="button" className="iconBtn" onClick={onClose} aria-label="Close results">
            ✕
          </button>
        </div>

        <div className="modalBody">
          <div className="resultsTop">
            <img className="resultsImage" src={product.image} alt="" />
            <div className="resultsMeta">
              <div className="resultsPrice">
                ${product.price.toFixed(2)}
              </div>
              <div className="resultsLine">
                Tries: <b>{won ? guesses.length : '5'}</b>
              </div>
              <div className="resultsLine">
                Score: <b>{score}</b>
              </div>
              <div className="resultsTitle">{product.title}</div>
            </div>
          </div>

          <div className="shareBlock">
            <div className="shareLabel">Share</div>
            <div className="shareGrid" aria-label="Emoji grid">
              {guesses.map((g, idx) => (
                <span key={idx} className="shareCell">
                  {warmthEmoji(g.warmth)}
                </span>
              ))}
              {Array.from({ length: Math.max(0, 5 - guesses.length) }).map((_, idx) => (
                <span key={`e-${idx}`} className="shareCell muted">
                  ⬜
                </span>
              ))}
            </div>
            <pre className="shareText">{shareText}</pre>
            <button type="button" className="primaryBtn" onClick={copy}>
              Copy results
            </button>
          </div>

          {won ? (
            <div className="shareBlock">
              <div className="shareLabel">Top 3</div>
              {leaderboard.length === 0 ? (
                <div className="resultsLine">Win a round to start your leaderboard.</div>
              ) : (
                <ol className="top3">
                  {leaderboard.map((e, i) => (
                    <li key={e.at} className="top3Row">
                      <span className="top3Rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                      <span className="top3Score">{e.score}</span>
                      <span className="top3Meta">
                        {e.tries}/5 • {e.mode === 'daily' ? `Daily ${e.dayKey}` : 'Random'}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

