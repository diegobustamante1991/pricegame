import { useMemo } from 'react'

type Props = {
  active: boolean
}

type Piece = {
  left: number
  delay: number
  duration: number
  size: number
  rot: number
  color: string
}

const COLORS = ['#22d3ee', '#a78bfa', '#fb7185', '#22c55e', '#f59e0b', '#60a5fa']

export function Confetti({ active }: Props) {
  const pieces = useMemo<Piece[]>(() => {
    // deterministic enough for UI; no need for seeded RNG
    const out: Piece[] = []
    for (let i = 0; i < 70; i++) {
      out.push({
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        duration: 1.6 + Math.random() * 1.2,
        size: 6 + Math.random() * 10,
        rot: Math.random() * 360,
        color: COLORS[i % COLORS.length],
      })
    }
    return out
  }, [])

  if (!active) return null

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confettiPiece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${Math.max(4, p.size * 0.6)}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  )
}

