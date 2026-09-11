import type { Category, Level } from '../types'

export const LEVEL_NUMBERS: Level[] = [1, 2, 3, 4, 5, 6, 7]

// Colors are CSS variables (src/index.css) so they can change with the light/dark theme.
export const LEVELS: Record<Level, { name: string; color: string; onColor: string }> = {
  1: { name: 'Beginner', color: 'var(--level-1)', onColor: 'var(--on-level-1)' },
  2: { name: 'Elementary', color: 'var(--level-2)', onColor: 'var(--on-level-2)' },
  3: { name: 'Pre-Intermediate', color: 'var(--level-3)', onColor: 'var(--on-level-3)' },
  4: { name: 'Intermediate', color: 'var(--level-4)', onColor: 'var(--on-level-4)' },
  5: { name: 'Upper-Intermediate', color: 'var(--level-5)', onColor: 'var(--on-level-5)' },
  6: { name: 'Advanced', color: 'var(--level-6)', onColor: 'var(--on-level-6)' },
  7: { name: 'Expert', color: 'var(--level-7)', onColor: 'var(--on-level-7)' },
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'basic', label: 'Basic Sounds' },
  { id: 'combination', label: 'Combinations' },
  { id: 'rolls-riffs', label: 'Rolls & Riffs' },
  { id: 'time-steps', label: 'Time Steps' },
  { id: 'air', label: 'Air Steps' },
  { id: 'turns', label: 'Turns' },
  { id: 'classic', label: 'Classic Steps & Routines' },
]

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<Category, string>

export function categoryLabel(category: Category): string {
  return CATEGORY_LABELS[category]
}
