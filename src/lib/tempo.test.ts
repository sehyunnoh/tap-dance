import { describe, expect, it } from 'vitest'
import { addTap, bpmFromTaps, clampBpm, MAX_BPM, MIN_BPM } from './tempo'

describe('clampBpm', () => {
  it('rounds and keeps the tempo within range', () => {
    expect(clampBpm(99.6)).toBe(100)
    expect(clampBpm(10)).toBe(MIN_BPM)
    expect(clampBpm(999)).toBe(MAX_BPM)
  })
})

describe('tap tempo', () => {
  it('needs at least two taps', () => {
    expect(bpmFromTaps([])).toBeNull()
    expect(bpmFromTaps([1000])).toBeNull()
  })

  it('averages the gaps between taps', () => {
    let taps: number[] = []
    for (const t of [0, 500, 1000, 1500]) taps = addTap(taps, t)
    expect(bpmFromTaps(taps)).toBe(120)
  })

  it('starts over after a long pause', () => {
    let taps: number[] = []
    for (const t of [0, 1000, 5000, 5750]) taps = addTap(taps, t)
    expect(taps).toEqual([5000, 5750])
    expect(bpmFromTaps(taps)).toBe(80)
  })

  it('keeps only the most recent taps', () => {
    let taps: number[] = []
    for (let i = 0; i < 10; i++) taps = addTap(taps, i * 600)
    expect(taps).toHaveLength(6)
    expect(bpmFromTaps(taps)).toBe(100)
  })
})
