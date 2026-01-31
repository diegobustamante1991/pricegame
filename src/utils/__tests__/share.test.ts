import { describe, expect, it } from 'vitest'
import type { GuessResult } from '../../types'
import { buildShareGrid, buildShareText, getDayNumber } from '../share'

describe('share utils', () => {
  it('computes a stable day number', () => {
    expect(getDayNumber('2024-01-01')).toBe(1)
    expect(getDayNumber('2024-01-02')).toBe(2)
  })

  it('builds a grid with three tiles per guess', () => {
    const guesses: GuessResult[] = [
      {
        guess: 50,
        direction: 'higher',
        warmth: 'warm',
        percentError: 0.08,
        withinTolerance: false,
      },
      {
        guess: 80,
        direction: 'correct',
        warmth: 'correct',
        percentError: 0,
        withinTolerance: true,
      },
    ]
    const grid = buildShareGrid(guesses)
    expect(grid[0]).toMatch(/🔽🟩🔒/)
    expect(grid[1]).toBe('🥒🥒🥒')
  })

  it('builds share text with header and rows', () => {
    const guesses: GuessResult[] = [
      {
        guess: 20,
        direction: 'lower',
        warmth: 'cold',
        percentError: 0.3,
        withinTolerance: false,
      },
    ]
    const text = buildShareText('2024-01-05', guesses)
    expect(text).toContain('peekle #5 1/5')
    expect(text).toContain('🔼🟥🔒')
  })
})
