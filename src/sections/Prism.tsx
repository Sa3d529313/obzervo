import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { gsap } from '../lib/scroll'
import { BrandWord } from '../components/Logo'
import { LiquidGlassLogo, type LiquidGlassLogoHandle } from '../components/liquid-glass-logo'
import { Ar } from '../components/Arabic'

const PrismScene = lazy(() => import('./PrismScene'))

// Which mark stands in the centre: the scroll-scrubbed liquid-glass logo, or the 3D glass capsules.
const USE_LIQUID_GLASS = true

// Scroll maps onto the glass sequence: it starts as a formed glass tile (distorting the mark),
// and clears to the bare mark just as the closing line arrives.
const GLASS_FROM = 0.3 // seconds into the sequence at the top of the section
const GLASS_TO = 1.8 // fully cleared
const GLASS_CLEAR_AT = 0.8 // section progress where it has cleared
const BOOT_AFTER = 5500 // ms after load: the loader (about 4.5s) is done by then

// One word per span, so each line can rise in (and leave) word by word.
function Words({ children }: { children: ReactNode[] }) {
  return (
    <>
      {children.map((w, i) => (
        <span className="pw" key={i}>
          {w}
          {i < children.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}

// Pinned stage in three beats, with the glass mark standing in the centre throughout:
//   1. "AI is the tool." rises in word by word, then lifts away
//   2. "Obzervo is the eye." does the same
//   3. the mark grows to centre stage and the closing line settles underneath
export function Prism() {
  const root = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const glass = useRef<LiquidGlassLogoHandle>(null)
  const [mount, setMount] = useState(false)
  const [active, setActive] = useState(false)
  const [warming, setWarming] = useState(true)

  // Boot the mark once the loader has finished (its setup is heavy enough to stutter the loading
  // animation) but well before the visitor scrolls in, and let it render for a moment
  // off-screen so it is already standing there when they arrive.
  useEffect(() => {
    const boot = setTimeout(() => setMount(true), BOOT_AFTER)
    const settle = setTimeout(() => setWarming(false), BOOT_AFTER + 1400)
    return () => {
      clearTimeout(boot)
      clearTimeout(settle)
    }
  }, [])

  // Only render frames while the section is within a screen of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting)
        if (e.isIntersecting) setMount(true) // reached before the timer: boot now
      },
      { rootMargin: '100% 0px' },
    )
    if (root.current) io.observe(root.current)
    return () => io.disconnect()
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const hidden = { opacity: 0, yPercent: 70, filter: 'blur(14px)' }
      const shown = { opacity: 1, yPercent: 0, filter: 'blur(0px)', ease: 'power3.out' }
      const gone = { opacity: 0, yPercent: -60, filter: 'blur(14px)', ease: 'power2.in' }
      gsap.set('.pw', hidden)

      const tl = gsap.timeline({
        defaults: { duration: 0.1 },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            progress.current = self.progress
            const p = Math.min(1, self.progress / GLASS_CLEAR_AT)
            glass.current?.seek(GLASS_FROM + p * (GLASS_TO - GLASS_FROM))
          },
        },
      })
      tl.to('.prism__line--a .pw', { ...shown, stagger: 0.025 }, 0.02)
        .to('.prism__line--a .pw', { ...gone, stagger: 0.015 }, 0.28)
        .to('.prism__line--b .pw', { ...shown, stagger: 0.025 }, 0.4)
        .to('.prism__line--b .pw', { ...gone, stagger: 0.015 }, 0.64)
        .fromTo('.prism__finale', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' }, 0.8)
        // The horizon light warms up across the whole section.
        .fromTo('.prism__horizon', { opacity: 0.6 }, { opacity: 1, duration: 1, ease: 'none' }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="prism" ref={root} id="studio">
      <div className="prism__sticky">
        <div className="prism__horizon" aria-hidden="true" />
        <div className="prism__canvas">
          {USE_LIQUID_GLASS ? mount && (
            <LiquidGlassLogo
              ref={glass}
              logo={`${import.meta.env.BASE_URL}logo.svg`}
              ending="logo"
              paused
              logoSize={300}
              logoScale={0.72}
              logoColor="#f3f6f7"
              background="#02070A"
              tileColor="#061722"
              aria-label="Obzervo"
              onReady={() => glass.current?.seek(GLASS_FROM + Math.min(1, progress.current / GLASS_CLEAR_AT) * (GLASS_TO - GLASS_FROM))}
              style={{ background: 'transparent' }}
            />
          ) : mount && (
            <Suspense fallback={null}>
              <PrismScene progress={progress} active={active || warming} />
            </Suspense>
          )}
        </div>

        <div className="prism__lines">
          <p className="prism__line prism__line--a">
            <Words>{['AI', 'is', 'the', <span key="w" className="serif accent-blue">tool.</span>]}</Words>
          </p>
          <p className="prism__line prism__line--b">
            <Words>{[<BrandWord key="b" />, 'is', 'the', <span key="w" className="serif accent-orange">eye.</span>]}</Words>
          </p>
        </div>

        <div className="prism__finale">
          <p className="prism__ar"><Ar>العين قبل الأداة.</Ar></p>
          <p className="prism__body">
            Anyone can generate. We look closely first — then direct every output until it’s unmistakably yours.
          </p>
        </div>

        <div className="prism__caption label">
          <span><BrandWord /> — from “observe”</span>
          <span>Look closely before creating</span>
        </div>
      </div>
    </section>
  )
}
