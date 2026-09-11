import { describe, expect, it } from 'vitest'
import type { Step } from '../types'
import { activeFilterCount, EMPTY_FILTERS, filterSteps, isFiltering, matchesQuery } from './search'

const step = (over: Partial<Step>): Step => ({
  id: 'x',
  name: 'X',
  aliases: [],
  level: 1,
  essential: true,
  category: 'basic',
  videos: [],
  ...over,
})

const pullback = step({ id: 'pullback', name: 'Pullback', aliases: ['Pull', 'Grab Off', 'Pick-Up'], level: 2, category: 'air' })
const shuffle = step({ id: 'shuffle', name: 'Shuffle', category: 'combination' })
const clunk = step({ id: 'clunk', name: 'Clunk', essential: false })
const all = [pullback, shuffle, clunk]

describe('matchesQuery', () => {
  it('matches names case-insensitively', () => {
    expect(matchesQuery(shuffle, 'SHUF')).toBe(true)
  })

  it('matches aliases regardless of spaces and hyphens', () => {
    expect(matchesQuery(pullback, 'pick up')).toBe(true)
    expect(matchesQuery(pullback, 'pick-up')).toBe(true)
    expect(matchesQuery(pullback, 'pickup')).toBe(true)
    expect(matchesQuery(pullback, 'grab off')).toBe(true)
  })

  it('does not match unrelated text', () => {
    expect(matchesQuery(shuffle, 'wing')).toBe(false)
  })

  it('treats an empty query as a match', () => {
    expect(matchesQuery(shuffle, '  ')).toBe(true)
  })
})

describe('filterSteps', () => {
  it('filters by level, category and essential flag together', () => {
    expect(filterSteps(all, { ...EMPTY_FILTERS, levels: [1] }).map((s) => s.id)).toEqual(['shuffle', 'clunk'])
    expect(filterSteps(all, { ...EMPTY_FILTERS, categories: ['air'] }).map((s) => s.id)).toEqual(['pullback'])
    expect(filterSteps(all, { ...EMPTY_FILTERS, essential: 'optional' }).map((s) => s.id)).toEqual(['clunk'])
    expect(filterSteps(all, { ...EMPTY_FILTERS, levels: [1], essential: 'essential' }).map((s) => s.id)).toEqual(['shuffle'])
  })
})

describe('filter state helpers', () => {
  it('counts active filters and detects searching', () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0)
    expect(isFiltering(EMPTY_FILTERS)).toBe(false)
    expect(activeFilterCount({ ...EMPTY_FILTERS, levels: [1, 2], essential: 'essential' })).toBe(3)
    expect(isFiltering({ ...EMPTY_FILTERS, query: 'flap' })).toBe(true)
  })
})
