import { readStorage, writeStorage } from './storage'

/** "system" follows the device; the other two are the user's explicit choice. */
export type ThemeMode = 'system' | 'light' | 'dark'

// index.html reads the same key before the first paint.
const STORAGE_KEY = 'theme'

// The browser UI color for each theme; matches --color-paper in src/index.css.
const PAPER = { light: '#fbfaf7', dark: '#1c1b18' }

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function readThemeMode(): ThemeMode {
  const stored = readStorage<unknown>(STORAGE_KEY, 'system')
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

export function saveThemeMode(mode: ThemeMode): void {
  writeStorage(STORAGE_KEY, mode)
}

function systemIsDark(): boolean {
  return typeof matchMedia === 'function' && matchMedia(DARK_QUERY).matches
}

/** Sets data-theme on <html> (read by src/index.css) and the browser's theme color. */
export function applyThemeMode(mode: ThemeMode): void {
  const root = document.documentElement
  if (mode === 'system') delete root.dataset.theme
  else root.dataset.theme = mode
  const dark = mode === 'dark' || (mode === 'system' && systemIsDark())
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? PAPER.dark : PAPER.light)
}

/** Calls back when the device switches between light and dark. */
export function onSystemThemeChange(callback: () => void): () => void {
  if (typeof matchMedia !== 'function') return () => {}
  const media = matchMedia(DARK_QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
