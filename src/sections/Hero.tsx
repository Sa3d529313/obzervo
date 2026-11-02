import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/scroll'
import { brandTileBg } from '../lib/brand'
import { Button } from '../components/Button'
import { LogoMark } from '../components/Logo'
import { HeroShader } from './HeroShader'

const STEPS = ['Observe', 'Define', 'Engineer', 'Deliver']

// Glass widget: a live "brand audit" that walks the four-step method on a loop.
function ObserveCard({ play }: { play: boolean }) {
  const [active, setActive] = useState(0)
  const score = useRef<HTMLElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!play) return
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2400)
    return () => clearInterval(id)
  }, [play])

  useEffect(() => {
    if (!play) return
    const target = [38, 61, 84, 97][active]
    const n = { v: Number(score.current?.textContent ?? 38) }
    const tw = gsap.to(n, {
      v: target,
      duration: 1.4,
      ease: 'expo.out',
      onUpdate: () => {
        if (score.current) score.current.textContent = String(Math.round(n.v))
      },
    })
    gsap.to(bar.current, { width: `${target}%`, duration: 1.4, ease: 'expo.out' })
    return () => {
      tw.kill()
    }
  }, [active, play])

  return (
    <aside className="dock-card observe-card glass glass--liquid" aria-label="Brand consistency audit">
      <div className="observe-card__head">
        <span className="label muted">Brand audit</span>
        <span className="observe-card__live label"><i />Live</span>
      </div>
      <div className="observe-card__score">
        <strong ref={score}>38</strong>
        <span className="muted">% on-brand</span>
      </div>
      <div className="observe-card__bar"><span ref={bar} style={{ width: '38%' }} /></div>
      <ol className="observe-card__steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i === active ? 'is-active' : i < active ? 'is-done' : ''}>
            <span className="idx">0{i + 1}</span>
            <span>{s}</span>
            <span className="state">{i === active ? 'Running' : i < active ? 'Done' : 'Queued'}</span>
          </li>
        ))}
      </ol>
    </aside>
  )
}

function VisualsCard() {
  return (
    <aside className="dock-card visuals-card glass" aria-hidden="true">
      <div className="dock-card__head">
        <span className="label muted">AI visuals</span>
        <span className="label muted">Campaign · 06</span>
      </div>
      <div className="visuals-card__grid">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} style={{ background: brandTileBg(i + 2) }}>
            <LogoMark />
          </span>
        ))}
      </div>
    </aside>
  )
}

function SystemCard() {
  return (
    <aside className="dock-card system-card glass" aria-hidden="true">
      <div className="dock-card__head">
        <span className="label muted">Brand system</span>
        <span className="system-card__lock label">Locked</span>
      </div>
      <div className="system-card__swatches">
        <span style={{ background: '#02070A' }}><b className="label">02070A</b></span>
        <span style={{ background: '#0297DE' }}><b className="label">0297DE</b></span>
        <span style={{ background: '#FC734D' }}><b className="label">FC734D</b></span>
      </div>
      <div className="system-card__type">
        <span className="system-card__aa">Aa</span>
        <span className="system-card__aa serif">Aa</span>
        <span className="label muted">Light · prism, soft<br />Grain · 0.06<br />Drift · 0</span>
      </div>
    </aside>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero__title .line-mask > span', { yPercent: 115 })
      gsap.set(['.hero__caption', '.hero__sub', '.hero__ctas'], { opacity: 0, y: 30 })
      gsap.set('.dock-card', { opacity: 0, y: 120 })
      // Hidden from the first frame, so the intro fades it in instead of snapping it out and back.
      gsap.set('.hero__bg', { opacity: 0 })

      // Scroll out: copy drifts up and fades, the card dock rises, background sinks.
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero__center, .hero__caption', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__bg', { yPercent: 20, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to('.hero__bg', { opacity: 1, duration: 2.2 }, 0)
        .to('.hero__caption', { opacity: 1, y: 0, duration: 1.2 }, 0.9)
        .to('.hero__title .line-mask > span', { yPercent: 0, duration: 1.4, stagger: 0.09 }, 0.2)
        .to(['.hero__sub', '.hero__ctas'], { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.5)
        .to('.dock-card', { opacity: 1, y: 0, duration: 1.6, stagger: 0.1 }, 0.75)
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__bg">
        <HeroShader running={ready} />
      </div>
      <div className="hero__vignette" />

      <p className="hero__caption">
        <span className="hero__caption-inner">
          AI creative design &amp; engineering studio
          <span className="hero__caption-dash glass" aria-hidden="true" />
        </span>
      </p>

      <div className="hero__center container">
        <h1 className="hero__title">
          <span className="line-mask"><span>Your AI, finally</span></span>
          <span className="line-mask"><span><span className="serif">on-brand.</span></span></span>
        </h1>
        <p className="hero__sub">
          We observe your business, then direct AI to build an identity, visuals and a website that look
          unmistakably like you. Every time.
        </p>
        <div className="hero__ctas">
          <Button href="#contact">Start a project</Button>
          <Button href="#method" variant="glass" arrow={false}>See the method</Button>
        </div>
      </div>

      <div className="hero__dock container">
        <VisualsCard />
        <ObserveCard play={ready} />
        <SystemCard />
      </div>
    </section>
  )
}
