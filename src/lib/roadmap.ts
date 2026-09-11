import type { Step } from '../types'
import type { PracticeStatuses } from './practice'

export interface LevelRoadmap {
  /** A step sits one stage below the latest step it builds on within the same level. */
  stages: Step[][]
  /** Links between steps of this level, from `prerequisites` and `nextSteps` together. */
  parents: ReadonlyMap<string, string[]>
  children: ReadonlyMap<string, string[]>
}

export function buildRoadmap(steps: readonly Step[]): LevelRoadmap {
  const ids = new Set(steps.map((s) => s.id))
  const parents = new Map<string, string[]>(steps.map((s) => [s.id, []]))
  const children = new Map<string, string[]>(steps.map((s) => [s.id, []]))
  const link = (from: string, to: string) => {
    if (from === to || !ids.has(from) || !ids.has(to) || parents.get(to)!.includes(from)) return
    parents.get(to)!.push(from)
    children.get(from)!.push(to)
  }
  for (const step of steps) {
    for (const id of step.prerequisites ?? []) link(id, step.id)
    for (const id of step.nextSteps ?? []) link(step.id, id)
  }

  // Some sibling steps point at each other (e.g. buck and traditional time steps); a link that
  // closes such a loop is ignored so the stages stay finite.
  const stage = new Map<string, number>()
  const visiting = new Set<string>()
  const stageOf = (id: string): number => {
    const known = stage.get(id)
    if (known !== undefined) return known
    if (visiting.has(id)) return -1
    visiting.add(id)
    let value = 0
    for (const parent of parents.get(id)!) value = Math.max(value, stageOf(parent) + 1)
    visiting.delete(id)
    stage.set(id, value)
    return value
  }

  const stages: Step[][] = []
  for (const step of steps) (stages[stageOf(step.id)] ??= []).push(step)
  return { stages: stages.filter(Boolean), parents, children }
}

/** Where a step stands for the user: their own mark, or whether everything it needs is learned. */
export type Readiness = 'learned' | 'learning' | 'ready' | 'blocked'

export function readinessOf(step: Step, statuses: PracticeStatuses): Readiness {
  const status = statuses[step.id]
  if (status) return status
  return (step.prerequisites ?? []).every((id) => statuses[id] === 'learned') ? 'ready' : 'blocked'
}
