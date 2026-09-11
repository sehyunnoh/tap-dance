import { describe, expect, it } from 'vitest'
import { CATEGORIES, LEVEL_NUMBERS } from './meta'
import { STEP_BY_ID, STEPS, stepsInLevel } from './steps'

const categoryIds = new Set(CATEGORIES.map((c) => c.id))

describe('step data', () => {
  it('has unique ids', () => {
    expect(STEP_BY_ID.size).toBe(STEPS.length)
  })

  it('has steps in every level, each with a valid level and category', () => {
    for (const level of LEVEL_NUMBERS) expect(stepsInLevel(level).length).toBeGreaterThan(0)
    for (const step of STEPS) {
      expect(LEVEL_NUMBERS, step.id).toContain(step.level)
      expect(categoryIds.has(step.category), `${step.id} category`).toBe(true)
    }
  })

  it('only links to steps that exist', () => {
    for (const step of STEPS) {
      for (const id of [...(step.prerequisites ?? []), ...(step.nextSteps ?? [])]) {
        expect(STEP_BY_ID.has(id), `${step.id} → ${id}`).toBe(true)
        expect(id, `${step.id} links to itself`).not.toBe(step.id)
      }
    }
  })

  it('has well-formed videos', () => {
    for (const step of STEPS) {
      expect(step.videos.length, `${step.id} video count`).toBeLessThanOrEqual(3)
      const ids = step.videos.map((v) => v.youtubeId)
      expect(new Set(ids).size, `${step.id} duplicate videos`).toBe(ids.length)
      for (const v of step.videos) {
        expect(v.youtubeId, step.id).toMatch(/^[\w-]{11}$/)
        expect(v.title.length, `${step.id} ${v.youtubeId} title`).toBeGreaterThan(0)
        if (v.loop) expect(v.loop.end, `${step.id} loop`).toBeGreaterThan(v.loop.start)
      }
    }
  })

  it('has one count entry per sound when both are given', () => {
    for (const step of STEPS) {
      if (step.count && step.sounds !== undefined) expect(step.count.length, step.id).toBe(step.sounds)
    }
  })

  it('has a slow tempo below the normal one', () => {
    for (const step of STEPS) {
      if (step.bpm) expect(step.bpm.slow, step.id).toBeLessThan(step.bpm.normal)
    }
  })
})
