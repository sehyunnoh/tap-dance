import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router'
import { Shell } from './components/Shell'
import { pageview } from './lib/analytics'
import { ListProvider } from './state/ListProvider'
import { MetronomeProvider } from './state/MetronomeProvider'
import { PracticeProvider } from './state/PracticeProvider'

// In-app navigation uses pushState, which fires no hashchange, so pageviews follow the router.
// Rendered after <Routes> so the page has already set document.title when this effect runs.
function PageviewTracker() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    pageview()
  }, [pathname, search])
  return null
}

// Hash URLs (…/tap-dance/#/steps/maxie-ford) keep deep links working on GitHub Pages.
export default function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  )
}
