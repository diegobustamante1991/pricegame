type Props = {
  open: boolean
  onClose: () => void
}

export function OnboardingModal({ open, onClose }: Props) {
  if (!open) return null
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="How to play">
      <div className="modal">
        <div className="modalHeader">
          <div className="modalTitle">How to play</div>
          <button type="button" className="iconBtn" onClick={onClose} aria-label="Close help">
            ✕
          </button>
        </div>
        <div className="modalBody">
          <div className="helpGrid">
            <div className="helpCard">
              <div className="helpTitle">Goal</div>
              <div className="helpText">Guess the product’s price in USD within 5 tries.</div>
            </div>
            <div className="helpCard">
              <div className="helpTitle">Clues</div>
              <div className="helpText">
                Start with the image only. Each wrong guess unlocks another clue.
              </div>
            </div>
            <div className="helpCard">
              <div className="helpTitle">Feedback</div>
              <div className="helpText">
                You’ll see <b>Higher</b>/<b>Lower</b> plus a warmth rating based on how close you are.
              </div>
            </div>
            <div className="helpCard">
              <div className="helpTitle">Win tolerance</div>
              <div className="helpText">You win if you’re within ±3% (minimum ±$1).</div>
            </div>
          </div>

          <button type="button" className="primaryBtn" onClick={onClose}>
            Let’s play
          </button>
        </div>
      </div>
    </div>
  )
}

