import { useLayoutEffect, useRef, type PointerEvent } from 'react'
import { gsap } from '../lib/scroll'
import { Reveal } from '../components/Reveal'
import { BrandWord, LogoMark } from '../components/Logo'
import { brandTileBg } from '../lib/brand'

// "Before": what undirected AI output looks like — eight posts, eight different brands.
const BEFORE = [
  { bg: 'linear-gradient(135deg,#ff00c8,#7b00ff)', font: 'Georgia, serif', label: 'Neon promo' },
  { bg: '#d9ff3c', font: 'Impact, sans-serif', label: 'SALE!!!', color: '#111' },
  { bg: 'linear-gradient(180deg,#8fd3f4,#84fab0)', font: 'Comic Sans MS, cursive', label: 'Summer vibes', color: '#123' },
  { bg: '#3b2a1e', font: 'Times New Roman, serif', label: 'Luxury?', color: '#e7c98a' },
  { bg: 'radial-gradient(circle at 30% 30%,#fff200,#ff5e00)', font: 'Arial Black, sans-serif', label: 'New drop', color: '#111' },
  { bg: '#e8e8e8', font: 'Courier New, monospace', label: 'stock photo #4', color: '#555' },
  { bg: 'linear-gradient(45deg,#00ffa3,#dc1fff)', font: 'Verdana, sans-serif', label: 'Web3 energy' },
  { bg: '#1e3a8a', font: 'Trebuchet MS, sans-serif', label: 'Corporate blue' },
]

// "After": the same eight briefs, run through one engineered brand system.
const AFTER = [
  'Campaign 01', 'Product 02', 'Social 03', 'Launch 04', 'Story 05', 'Product 06', 'Campaign 07', 'Social 08',
]

export function Compare() {
  const frame = useRef<HTMLDivElement>(null)
  const after = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLDivElement>(null)
  const pos = useRef({ v: 88 })

  const apply = (v: number) => {
    pos.current.v = v
    if (after.current) after.current.style.clipPath = `inset(0 0 0 ${v}%)`
    if (handle.current) handle.current.style.left = `${v}%`
  }

  // Sweep the divider in once the frame scrolls into view.
  useLayoutEffect(() => {
    apply(88)
    const ctx = gsap.context(() => {
      gsap.to(pos.current, {
        v: 46,
        duration: 2,
        ease: 'expo.inOut',
        onUpdate: () => apply(pos.current.v),
        scrollTrigger: { trigger: frame.current, start: 'top 70%', once: true },
      })
    }, frame)
    return () => ctx.revert()
  }, [])

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || e.buttons) {
      const r = frame.current!.getBoundingClientRect()
      const v = gsap.utils.clamp(4, 96, ((e.clientX - r.left) / r.width) * 100)
      gsap.to(pos.current, { v, duration: 0.6, ease: 'power3.out', onUpdate: () => apply(pos.current.v), overwrite: true })
    }
  }

  return (
    <section className="section" id="difference">
      <div className="container">
        <div className="compare__head">
          <Reveal>
            <p className="section-label label">The difference</p>
            <h2 className="h2">
              Same AI.
              <br />
              <span className="serif">Directed.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>Left: eight AI outputs from one business, no direction. Right: the same eight briefs, run through an engineered <BrandWord /> brand system. Drag to compare.</p>
          </Reveal>
        </div>

        <Reveal>
          <div className="compare__frame" ref={frame} onPointerMove={onMove} onPointerDown={onMove} data-cursor>
            <div className="compare__pane compare__pane--before">
              <span className="compare__tag glass label">Undirected AI</span>
              <div className="compare__grid">
                {BEFORE.map((t, i) => (
                  <div
                    key={i}
                    className="compare__tile"
                    style={{ background: t.bg, fontFamily: t.font, color: t.color ?? '#fff', transform: `rotate(${(i % 3) - 1}deg)` }}
                  >
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="compare__pane compare__pane--after" ref={after}>
              <span className="compare__tag glass label">Directed by <BrandWord /></span>
              <div className="compare__grid">
                {AFTER.map((label, i) => (
                  <div key={i} className="compare__tile compare__tile--brand" style={{ background: brandTileBg(i) }}>
                    <span className="label">{label}</span>
                    <LogoMark className="compare__tile-mark" />
                  </div>
                ))}
              </div>
            </div>

            <div className="compare__handle" ref={handle}>
              <span className="compare__knob glass">
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
                  <path d="M6 1 1 6l5 5M16 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
