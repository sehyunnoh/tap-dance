import type { Level, Step } from '../types'

const modules = import.meta.glob<Step[]>('./steps/level-*.json', { eager: true, import: 'default' })

/** Every step, ordered by level and then by syllabus order within the level. */
export const STEPS: Step[] = Object.keys(modules)
  .sort()
  .flatMap((key) => modules[key])

export const STEP_BY_ID = new Map(STEPS.map((step) => [step.id, step]))

const BY_LEVEL = new Map<Level, Step[]>()
for (const step of STEPS) {
  const list = BY_LEVEL.get(step.level) ?? []
  list.push(step)
  BY_LEVEL.set(step.level, list)
}

export function stepsInLevel(level: Level): Step[] {
  return BY_LEVEL.get(level) ?? []
}

export function hasDetails(step: Step): boolean {
  return Boolean(step.description)
}

export function youtubeSearchUrl(step: Step): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${step.name} tap dance tutorial`)}`
}
