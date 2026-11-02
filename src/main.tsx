import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/sections.css'
import App from './App'

// Scroll restoration is switched off in lib/scroll (via ScrollTrigger); start at the top regardless.
// A section hash (e.g. #contact) would make the browser jump there on reload, so drop it.
if (location.hash) history.replaceState(null, '', location.pathname + location.search)
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
