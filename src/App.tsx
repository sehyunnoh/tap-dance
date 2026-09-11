import { HashRouter, Route, Routes } from 'react-router'
import { Shell } from './components/Shell'
import { ListProvider } from './state/ListProvider'
import { MetronomeProvider } from './state/MetronomeProvider'

// Hash URLs (…/tap-dance/#/steps/maxie-ford) keep deep links working on GitHub Pages.
export default function App() {
  return (
    <HashRouter>
      <ListProvider>
        <MetronomeProvider>
          <Routes>
            <Route path="*" element={<Shell />} />
          </Routes>
        </MetronomeProvider>
      </ListProvider>
    </HashRouter>
  )
}
