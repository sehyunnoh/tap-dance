import { describe, expect, it } from 'vitest'
import type { Step } from '../types'
import { nextToPractice, progressOf, sanitizeStatuses, withStatus } from './practice'

const step = (id: string, essential = true): Step => ({
  id,
  name: id,
  aliases: [],
  level: 1,
  essential,
  category: 'basic',
  videos: [],
})

const toe = step('toe')
const heel = step('heel')
const clunk = step('clunk', false)
const all = [toe, heel, clunk]

describe('sanitizeStatuses', () => {
  it('keeps valid entries and drops the rest', () => {
    expect(sanitizeStatuses({ toe: 'learned', heel: 'learning', clunk: 'mastered', x: 3 })).toEqual({ toe: 'learned', heel: 'learning' })
  })

  it('ignores stored values that are not an object', () => {
    expect(sanitizeStatuses(null)).toEqual({})
    expect(sanitizeStatuses(['toe'])).toEqual({})
    expect(sanitizeStatuses('learned')).toEqual({})
  })
})

describe('withStatus', () => {
  it('sets and clears a step without touching the original', () => {
    const before = { toe: 'learning' } as const
    expect(withStatus(before, 'toe', 'learned')).toEqual({ toe: 'learned' })
    expect(withStatus(before, 'toe', null)).toEqual({})
    expect(before).toEqual({ toe: 'learning' })
  })
})

describe('progressOf', () => {
  it('counts learned and learning steps', () => {
    expect(progressOf(all, { toe: 'learned', heel: 'learning', other: 'learned' })).toEqual({ learned: 1, learning: 1, total: 3 })
  })
})

describe('nextToPractice', () => {
  it('picks the first essential step that is not learned', () => {
    expect(nextToPractice(all, {})?.id).toBe('toe')
    expect(nextToPractice(all, { toe: 'learned' })?.id).toBe('heel')
    expect(nextToPractice(all, { toe: 'learned', heel: 'learning' })?.id).toBe('heel')
  })

  it('moves on to optional steps, then to nothing', () => {
    expect(nextToPractice(all, { toe: 'learned', heel: 'learned' })?.id).toBe('clunk')
    expect(nextToPractice(all, { toe: 'learned', heel: 'learned', clunk: 'learned' })).toBeUndefined()
  })
})
