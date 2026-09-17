import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'
import { redirectLegacyHashUrl } from './lib/legacyHashUrl'

redirectLegacyHashUrl()
initAnalytics()

// The prerendered markup (scripts/prerender.mjs) is there for search engines and the first paint.
// We render over it instead of hydrating: the real UI depends on localStorage (theme, practice
// progress, metronome tempo), which the prerender cannot know, so hydration would mismatch.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
