import type { Clue } from '../types'

type Props = {
  clues: Clue[]
  revealed: number
}

export function ClueStack({ clues, revealed }: Props) {
  return (
    <section className="clueStack" aria-label="Clues">
      {clues.map((clue, idx) => {
        const isUnlocked = idx < revealed
        const label = `Clue ${idx + 1}`

        if (!isUnlocked) {
          return (
            <div key={idx} className="clue locked" aria-label={`${label} locked`}>
              <div className="clueTitle">{label}</div>
              <div className="clueBody lockedBody">Locked</div>
            </div>
          )
        }

        if (clue.type === 'image') {
          return (
            <div key={idx} className="clue unlocked" aria-label={label}>
              <div className="clueTitle">{label}</div>
              <div className="clueBody">Image revealed above.</div>
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

