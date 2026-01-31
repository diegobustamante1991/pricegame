import { BUTTONS, HELP, LABELS } from '../content'

type Props = {
  open: boolean
  onClose: () => void
}

export function OnboardingModal({ open, onClose }: Props) {
  if (!open) return null
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label={HELP.header}>
      <div className="modal">
        <div className="modalHeader">
          <div className="modalTitle">{HELP.header}</div>
          <button type="button" className="iconBtn" onClick={onClose} aria-label={LABELS.helpClose}>
            ✕
          </button>
        </div>
        <div className="modalBody">
          <ul className="helpList">
            {HELP.bullets.map((item) => (
              <li key={item} className="helpListItem">
                {item}
              </li>
            ))}
          </ul>
          <button type="button" className="primaryBtn" onClick={onClose}>
            {BUTTONS.start}
          </button>
        </div>
      </div>
    </div>
  )
}

