import type { Category, Level } from '../types'

export const LEVEL_NUMBERS: Level[] = [1, 2, 3, 4, 5, 6, 7]

export const LEVELS: Record<Level, { name: string; color: string; onColor: string }> = {
  1: { name: 'Beginner', color: '#3f9d5a', onColor: '#ffffff' },
  2: { name: 'Elementary', color: '#3b78c9', onColor: '#ffffff' },
  3: { name: 'Pre-Intermediate', color: '#8a5bc7', onColor: '#ffffff' },
  4: { name: 'Intermediate', color: '#d9a91f', onColor: '#262521' },
  5: { name: 'Upper-Intermediate', color: '#e07b2e', onColor: '#ffffff' },
  6: { name: 'Advanced', color: '#d0433a', onColor: '#ffffff' },
  7: { name: 'Expert', color: '#262521', onColor: '#ffffff' },
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
