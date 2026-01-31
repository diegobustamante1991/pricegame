import type { GameMode } from '../types'

type Props = {
  mode: GameMode
  dayKey: string
  liveEnabled: boolean
  onModeChange: (mode: GameMode) => void
  onNewRandom: () => void
  onDemo: () => void
  onOpenHelp: () => void
}

export function GameHeader({
  mode,
  dayKey,
  liveEnabled,
  onModeChange,
  onNewRandom,
  onDemo,
  onOpenHelp,
}: Props) {
  return (
    <header className="header">
      <div className="brand">
        <div className="brandMark" aria-hidden="true">
          $
        </div>
        <div>
          <div className="brandName">PricePeek</div>
          <div className="brandSub">
            {mode === 'daily'
              ? `Daily • ${dayKey}`
              : liveEnabled
                ? 'Random • Live Amazon'
                : 'Random mode'}
          </div>
        </div>
      </div>

      <div className="headerActions">
        <div className="segmented" role="radiogroup" aria-label="Game mode">
          <button
            type="button"
            className={`segBtn ${mode === 'daily' ? 'isActive' : ''}`}
            onClick={() => onModeChange('daily')}
            aria-pressed={mode === 'daily'}
          >
            Daily
          </button>
          <button
            type="button"
            className={`segBtn ${mode === 'random' ? 'isActive' : ''}`}
            onClick={() => onModeChange('random')}
            aria-pressed={mode === 'random'}
          >
            Random
          </button>
        </div>

        {mode === 'random' ? (
          <button type="button" className="ghostBtn" onClick={onNewRandom}>
            New
          </button>
        ) : null}

        <button type="button" className="ghostBtn" onClick={onDemo}>
          Demo
        </button>

        <button type="button" className="ghostBtn" onClick={onOpenHelp}>
          How to play
        </button>
      </div>
    </header>
  )
}

