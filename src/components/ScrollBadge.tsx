import { useEffect, useRef } from 'react'
import { gsap, getLenis, scrollToTarget, ScrollTrigger } from '../lib/scroll'
import { LogoMark } from './Logo'

const RING_TEXT = 'Observe · Define · Engineer · Deliver · '

// One colour per section, in page order — the badge cross-fades as each section takes
// over the middle of the screen, so moving down the page feels like moving between rooms.
const SECTION_COLORS = [
  '#F3F6F7', // hero — paper
  '#FC734D', // problem — cantaloupe
  '#5CC3F2', // method — sky
  '#FFA98F', // services — peach
  '#0297DE', // difference — electric blue
  '#FFD9C9', // studio — pale peach
  '#8FD3F7', // why obzervo — ice blue
  '#FC734D', // contact — cantaloupe
]

// Corner badge: the mark spins with scroll momentum — a scroll flick kicks it fast,
// then friction bleeds the spin off. The text ring counter-rotates more slowly.
export function ScrollBadge({ visible }: { visible: boolean }) {
  const badge = useRef<HTMLButtonElement>(null)
  const mark = useRef<HTMLDivElement>(null)
  const ring = useRef<SVGSVGElement>(null)

  useEffect(() => {
    let angle = 0
    let omega = 0 // degrees per frame
    const tick = () => {
      const v = getLenis()?.velocity ?? 0
      omega += (v * 0.9 - omega) * 0.12 // follow the scroll speed, with inertia
      omega *= 0.97 // friction
      angle += omega + 0.08 // a slow idle drift so it never fully stops
      if (mark.current) mark.current.style.transform = `rotate(${angle}deg)`
      if (ring.current) ring.current.style.transform = `rotate(${-angle * 0.35}deg)`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>('main > section')
    const triggers = sections.map((section, i) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) badge.current?.style.setProperty('--badge-color', SECTION_COLORS[i % SECTION_COLORS.length])
        },
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <button
      ref={badge}
      className={`scroll-badge ${visible ? 'is-visible' : ''}`}
      onClick={() => scrollToTarget(0)}
      aria-label="Back to top"
    >
      <svg ref={ring} className="scroll-badge__ring" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <text>
          <textPath href="#badge-circle" textLength="250">{RING_TEXT}</textPath>
        </text>
      </svg>
      <div className="scroll-badge__mark" ref={mark}>
        <LogoMark />
      </div>
    </button>
  )
}
