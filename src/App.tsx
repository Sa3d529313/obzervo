import { memo, useCallback, useEffect, useState } from 'react'
import { initSmoothScroll, ScrollTrigger } from './lib/scroll'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { ScrollBadge } from './components/ScrollBadge'
import { Nav } from './components/Nav'
import { LiquidGlassFilter } from './components/LiquidGlassFilter'
import { Hero } from './sections/Hero'
import { Marquee } from './sections/Marquee'
import { Manifesto } from './sections/Manifesto'
import { Method } from './sections/Method'
import { Services } from './sections/Services'
import { Compare } from './sections/Compare'
import { Prism } from './sections/Prism'
import { Principles } from './sections/Principles'
import { Contact } from './sections/Contact'

// Everything below the hero is static: memoised so the loader's state changes (curtain lifting,
// loader unmounting) don't re-render the whole page mid-animation.
const Sections = memo(function Sections() {
  return (
    <>
      <Marquee />
      <Manifesto />
      <Method />
      <Services />
      <Compare />
      <Prism />
      <Principles />
      <Contact />
    </>
  )
})

export default function App() {
  const [revealed, setRevealed] = useState(false) // curtain lifting: hero intro plays
  const [loading, setLoading] = useState(true) // preloader still mounted

  useEffect(() => {
    // Every load starts at the top — never resume mid-page after a refresh.
    const lenis = initSmoothScroll()
    lenis.stop()
    lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }, [])

  const reveal = useCallback(() => setRevealed(true), [])
  const done = useCallback(() => {
    setLoading(false)
    initSmoothScroll().start()
    // Re-measure once the hero intro has had its frames, not in the middle of them.
    setTimeout(() => ScrollTrigger.refresh(), 1200)
  }, [])

  // Fonts change line lengths, so re-measure pinned sections once they land.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <LiquidGlassFilter />
      {loading && <Preloader onReveal={reveal} onDone={done} />}
      <Cursor />
      <Nav />
      <ScrollBadge visible={!loading} />
      <main>
        <Hero ready={revealed} />
        <Sections />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  )
}
