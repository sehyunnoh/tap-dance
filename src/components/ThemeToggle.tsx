import { useEffect, useState } from 'react'
import { track } from '../lib/analytics'
import { applyThemeMode, onSystemThemeChange, readThemeMode, saveThemeMode, type ThemeMode } from '../lib/theme'
import { MonitorIcon, MoonIcon, SunIcon } from './icons'

const NEXT: Record<ThemeMode, ThemeMode> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<ThemeMode, string> = { system: 'System', light: 'Light', dark: 'Dark' }
const ICON = { system: MonitorIcon, light: SunIcon, dark: MoonIcon }

/** Cycles System → Light → Dark. */
export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(readThemeMode)
  const Icon = ICON[mode]

  useEffect(() => {
    applyThemeMode(mode)
    // Following the device: keep the browser's theme color in step when it switches.
    if (mode === 'system') return onSystemThemeChange(() => applyThemeMode('system'))
  }, [mode])

  function cycle() {
    const next = NEXT[mode]
    setMode(next)
    saveThemeMode(next)
    track('theme', { mode: next })
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${LABEL[mode]}. Switch to ${LABEL[NEXT[mode]]}`}
      title={`Theme: ${LABEL[mode]}`}
      className="flex h-10 items-center gap-1.5 rounded-[10px] border-[1.5px] border-ink bg-card px-2.5 text-sm hover:bg-soft"
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{LABEL[mode]}</span>
    </button>
  )
}
