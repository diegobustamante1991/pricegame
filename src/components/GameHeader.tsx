import type { GameMode } from '../types'
import { APP, BUTTONS, LABELS } from '../content'

type Props = {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  onNewRandom: () => void
  onDemo: () => void
  onOpenHelp: () => void
}

export function GameHeader({
  mode,
  onModeChange,
  onNewRandom,
  onDemo,
  onOpenHelp,
}: Props) {
  return (
    <header className="header">
      <div className="brand">
        <div className="brandMark" aria-label={`${APP.name} logo`} role="img">
          $
        </div>
        <div>
          <div className="brandName">{APP.name}</div>
          <div className="brandSub">{APP.tagline}</div>
          <div className="brandMeta">{APP.subtext}</div>
        </div>
      </div>

      <div className="headerActions">
        <div className="segmented" role="radiogroup" aria-label={LABELS.gameMode}>
          <button
            type="button"
            className={`segBtn ${mode === 'daily' ? 'isActive' : ''}`}
            onClick={() => onModeChange('daily')}
            aria-pressed={mode === 'daily'}
          >
            {LABELS.daily}
          </button>
          <button
            type="button"
            className={`segBtn ${mode === 'random' ? 'isActive' : ''}`}
            onClick={() => onModeChange('random')}
            aria-pressed={mode === 'random'}
          >
            {LABELS.random}
          </button>
        </div>

        {mode === 'random' ? (
          <button type="button" className="ghostBtn" onClick={onNewRandom}>
            {BUTTONS.next}
          </button>
        ) : null}

        <button type="button" className="ghostBtn" onClick={onDemo}>
          {BUTTONS.demo}
        </button>

        <button type="button" className="ghostBtn" onClick={onOpenHelp}>
          {BUTTONS.help}
        </button>
      </div>
    </header>
  )
}

