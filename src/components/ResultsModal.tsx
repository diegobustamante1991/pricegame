import type { GuessResult, Product } from '../types'
import { calculateScore } from '../utils/score'
import { BUTTONS, LABELS, RESULTS, STATES } from '../content'
import { buildShareGrid, buildShareText } from '../utils/share'
import { Confetti } from './Confetti'
import { loadLeaderboard, type LeaderboardEntry } from '../utils/storage'

type Props = {
  open: boolean
  dayKey: string
  product: Product
  guesses: GuessResult[]
  won: boolean
  onClose: () => void
}

export function ResultsModal({ open, dayKey, product, guesses, won, onClose }: Props) {
  if (!open) return null
  const score = calculateScore(guesses, won)
  const leaderboard = loadLeaderboard()
    .slice()
    .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
    .slice(0, 3)
  const shareText = buildShareText(dayKey, guesses)
  const shareGrid = buildShareGrid(guesses)

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText)
    } catch {
      // ignore
    }
  }

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label={LABELS.results}>
      <div className="modal">
        <Confetti active={won} />
        <div className="modalHeader">
          <div className="modalTitle">
            {won ? STATES.win : STATES.lose(`$${product.price.toFixed(2)}`)}
          </div>
          <button
            type="button"
            className="iconBtn"
            onClick={onClose}
            aria-label={LABELS.resultsClose}
          >
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
                {LABELS.tries}: <b>{won ? guesses.length : '5'}</b>
              </div>
              <div className="resultsLine">
                {LABELS.score}: <b>{score}</b>
              </div>
              <div className="resultsTitle">{product.title}</div>
            </div>
          </div>

          <div className="shareBlock">
            <div className="shareLabel">{BUTTONS.share}</div>
            <div className="shareGrid" aria-label={LABELS.shareGrid}>
              {shareGrid.map((row, idx) => (
                <div key={idx} className="shareRow">
                  {row}
                </div>
              ))}
            </div>
            <pre className="shareText">{shareText}</pre>
            <button type="button" className="primaryBtn" onClick={copy}>
              {BUTTONS.share}
            </button>
          </div>

          {won ? (
            <div className="shareBlock">
              <div className="shareLabel">{LABELS.top3}</div>
              {leaderboard.length === 0 ? (
                <div className="resultsLine">{RESULTS.leaderboardEmpty}</div>
              ) : (
                <ol className="top3">
                  {leaderboard.map((e, i) => (
                    <li key={e.at} className="top3Row">
                      <span className="top3Rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                      <span className="top3Score">{e.score}</span>
                      <span className="top3Meta">
                        {e.tries}/5 • {e.mode === 'daily' ? `${LABELS.daily} ${e.dayKey}` : LABELS.random}
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

