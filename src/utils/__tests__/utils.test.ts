import { describe, expect, it } from 'vitest'
import { seededRandom } from '../random'
import { percentError, toleranceCheck, warmthLabel } from '../price'

describe('seededRandom', () => {
  it('is deterministic for the same seed', () => {
    const a = seededRandom('2026-01-28')
    const b = seededRandom('2026-01-28')
    const seqA = [a(), a(), a()]
    const seqB = [b(), b(), b()]
    expect(seqA).toEqual(seqB)
  })
})

describe('percentError', () => {
  it('returns 0 for exact match', () => {
    expect(percentError(10, 10)).toBe(0)
  })
})

describe('toleranceCheck', () => {
  it('uses minimum tolerance of $1', () => {
    expect(toleranceCheck(10.5, 10, 0.03, 1)).toBe(true) // $0.5 off, min $1
    expect(toleranceCheck(11.2, 10, 0.03, 1)).toBe(false)
  })

  it('uses percentage tolerance when larger than minimum', () => {
    // actual=100, 3% => $3 tolerance
    expect(toleranceCheck(102.99, 100, 0.03, 1)).toBe(true)
    expect(toleranceCheck(103.01, 100, 0.03, 1)).toBe(false)
  })
})

describe('warmthLabel', () => {
  it('returns correct when within tolerance', () => {
    expect(warmthLabel(0.5, true)).toBe('correct')
  })

  it('scales from ice to scorching', () => {
    expect(warmthLabel(1.2, false)).toBe('ice')
    expect(warmthLabel(0.6, false)).toBe('cold')
    expect(warmthLabel(0.3, false)).toBe('warm')
    expect(warmthLabel(0.12, false)).toBe('hot')
    expect(warmthLabel(0.05, false)).toBe('scorching')
  })
})

