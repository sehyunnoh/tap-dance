import { describe, expect, it } from 'vitest'
import type { Step } from '../types'
import { buildRoadmap, readinessOf } from './roadmap'

const step = (id: string, over: Partial<Step> = {}): Step => ({
  id,
  name: id,
  aliases: [],
  level: 1,
  essential: true,
  category: 'basic',
  videos: [],
  ...over,
})

const stageIds = (steps: Step[]) => buildRoadmap(steps).stages.map((stage) => stage.map((s) => s.id))

describe('buildRoadmap', () => {
  it('puts each step one stage below the latest step it builds on', () => {
    const steps = [
      step('brush'),
      step('spank'),
      step('shuffle', { prerequisites: ['brush', 'spank'] }),
      step('shuffle-step', { prerequisites: ['shuffle'] }),
      step('hop'),
    ]
    expect(stageIds(steps)).toEqual([['brush', 'spank', 'hop'], ['shuffle'], ['shuffle-step']])
  })

  it('uses nextSteps links too and ignores links to other levels', () => {
    const steps = [step('a', { nextSteps: ['b'] }), step('b', { prerequisites: ['earlier-level-step'] })]
    const roadmap = buildRoadmap(steps)
    expect(stageIds(steps)).toEqual([['a'], ['b']])
    expect(roadmap.parents.get('b')).toEqual(['a'])
    expect(roadmap.children.get('a')).toEqual(['b'])
  })

  it('survives steps that point at each other', () => {
    const steps = [step('buck', { prerequisites: ['traditional'] }), step('traditional', { prerequisites: ['buck'] })]
    const stages = stageIds(steps)
    expect(stages.flat().sort()).toEqual(['buck', 'traditional'])
    expect(stages).toHaveLength(2)
  })
})

describe('readinessOf', () => {
  const shuffle = step('shuffle', { prerequisites: ['brush', 'spank'] })

  it('uses the step’s own mark first', () => {
    expect(readinessOf(shuffle, { shuffle: 'learning' })).toBe('learning')
    expect(readinessOf(shuffle, { shuffle: 'learned' })).toBe('learned')
  })

  it('is ready when every prerequisite is learned, otherwise blocked', () => {
    expect(readinessOf(shuffle, { brush: 'learned', spank: 'learned' })).toBe('ready')
    expect(readinessOf(shuffle, { brush: 'learned', spank: 'learning' })).toBe('blocked')
    expect(readinessOf(step('toe'), {})).toBe('ready')
  })
})
