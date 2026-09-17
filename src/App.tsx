import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { Shell } from './components/Shell'
import { pageview } from './lib/analytics'
import { ListProvider } from './state/ListProvider'
import { MetronomeProvider } from './state/MetronomeProvider'
import { PracticeProvider } from './state/PracticeProvider'

// Vite's `base` (/tap-dance/); the router strips it from the URL and puts it back on every link.
export const BASENAME = import.meta.env.BASE_URL

// In-app navigation uses pushState, which fires no popstate, so pageviews follow the router.
// Rendered after <Routes> so the page has already set document.title when this effect runs.
function PageviewTracker() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    pageview()
  }, [pathname, search])
  return null
}

/** Everything below the router, so the prerender can wrap the same tree in a <StaticRouter>. */
export function AppRoutes() {
  return (
    <PracticeProvider>
      <ListProvider>
        <MetronomeProvider>
          <Routes>
            <Route path="*" element={<Shell />} />
          </Routes>
          <PageviewTracker />
        </MetronomeProvider>
      </ListProvider>
    </PracticeProvider>
  )
}

// Real paths (…/tap-dance/steps/maxie-ford/), so every step is its own page for search engines.
// scripts/prerender.mjs writes an HTML file per route; dist/404.html covers anything it missed.
export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <AppRoutes />
    </BrowserRouter>
  )
}
