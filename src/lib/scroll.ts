import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// The site always opens at the top, even on refresh. This must go through ScrollTrigger: it
// remembers the browser's setting when it loads and writes it back on every refresh(), which
// silently turned a plain `history.scrollRestoration = 'manual'` back into 'auto'.
ScrollTrigger.clearScrollMemory('manual')

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis) return lenis
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  lenis = new Lenis({ lerp: reduce ? 1 : 0.085, smoothWheel: !reduce, anchors: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function scrollToTarget(target: string | number) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6, offset: 0 })
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export { gsap, ScrollTrigger }
