import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { Ar } from '../components/Arabic'

const STEPS = [
  {
    title: 'Observe',
    ar: 'نتأمّل',
    body: 'We study the company — product, audience, market, and exactly what it’s doing wrong with AI today.',
    visual: 'observe',
  },
  {
    title: 'Define',
    ar: 'نُحدّد',
    body: 'A clear identity: visual character, palette, typography, tone, and the rules for what the brand looks and feels like.',
    visual: 'define',
  },
  {
    title: 'Engineer',
    ar: 'نُهندس',
    body: 'That identity becomes an AI system — prompts, styles, references and workflows that output on-brand work every time.',
    visual: 'engineer',
  },
  {
    title: 'Deliver',
    ar: 'نُسلّم',
    body: 'Brand visuals, product imagery, campaign content and a custom-engineered website. All AI-made. All unmistakably you.',
    visual: 'deliver',
  },
] as const

function StepVisual({ kind }: { kind: (typeof STEPS)[number]['visual'] }) {
  if (kind === 'observe')
    return (
      <div className="step-card__visual sv-observe">
        <span className="ring r1" />
        <span className="ring r2" />
        <span className="ring r3" />
        <span className="iris" />
        <span className="sweep" />
      </div>
    )
  if (kind === 'define')
    return (
      <div className="step-card__visual sv-define">
        <span className="sw" style={{ background: '#02070A' }} />
        <span className="sw" style={{ background: '#0297DE' }} />
        <span className="sw" style={{ background: '#FC734D' }} />
        <span className="aa serif">Aa</span>
      </div>
    )
  if (kind === 'engineer')
    return (
      <ul className="step-card__visual sv-engineer">
        {['Prompts', 'Styles', 'References', 'Workflows'].map((s, i) => (
          <li key={s} style={{ animationDelay: `${i * 0.6}s` }}>
            <span>{s}</span>
            <i />
          </li>
        ))}
      </ul>
    )
  return (
    <div className="step-card__visual sv-deliver">
      <span className="frame f1" />
      <span className="frame f2" />
      <span className="frame f3" />
    </div>
  )
}

export function Method() {
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth + 40)
      const bars = gsap.utils.toArray<HTMLElement>('.method__progress i')
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            bars.forEach((b, i) => {
              const local = gsap.utils.clamp(0, 1, self.progress * bars.length - i)
              b.style.transform = `scaleX(${local})`
            })
          },
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="method" id="method" ref={root}>
      <div className="method__pin" ref={pin}>
        <div className="method__glow" />
        <div className="container method__head">
          <div>
            <p className="section-label label">The method</p>
            <h2 className="h2">
              Look closely.
              <br />
              Then <span className="serif">create.</span>
            </h2>
          </div>
          <div className="method__progress" aria-hidden="true">
            {STEPS.map((s) => (
              <span key={s.title}><i /></span>
            ))}
          </div>
        </div>
        <div className="method__track" ref={track}>
          {STEPS.map((s, i) => (
            <article className="step-card glass" key={s.title}>
              <div className="step-card__top label">
                <span>0{i + 1}</span>
                <span>/ 04</span>
              </div>
              <StepVisual kind={s.visual} />
              <div>
                <h3>
                  {s.title} <Ar className="step-card__ar">{s.ar}</Ar>
                </h3>
                <p>{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
