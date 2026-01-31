import type { Clue } from '../types'
import { LABELS } from '../content'

type Props = {
  clues: Clue[]
  revealed: number
}

export function ClueStack({ clues, revealed }: Props) {
  return (
    <section className="clueStack" aria-label={LABELS.clues}>
      {clues.map((clue, idx) => {
        const isUnlocked = idx < revealed
        const label = LABELS.clue(idx + 1)

        if (!isUnlocked) {
          return (
            <div key={idx} className="clue locked" aria-label={LABELS.clueLockedAria(label)}>
              <div className="clueTitle">{label}</div>
              <div className="clueBody lockedBody">{LABELS.clueLocked}</div>
            </div>
          )
        }

        if (clue.type === 'image') {
          return (
            <div key={idx} className="clue unlocked" aria-label={label}>
              <div className="clueTitle">{label}</div>
              <div className="clueBody">{LABELS.clueImage}</div>
            </div>
          )
        }

        return (
          <div key={idx} className="clue unlocked revealAnim" aria-label={label}>
            <div className="clueTitle">{label}</div>
            <div className="clueBody">{clue.value}</div>
          </div>
        )
      })}
    </section>
  )
}

