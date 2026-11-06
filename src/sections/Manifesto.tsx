import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { Reveal } from '../components/Reveal'
import { BrandWord } from '../components/Logo'
import { Ar } from '../components/Arabic'

// Words light up one by one as the paragraph scrolls through the viewport.
const TEXT: { w: string; serif?: boolean }[] = [
  ...'Every business has AI now. Most of them use it badly — generic images, template websites, no two outputs that look like the same brand.'
    .split(' ')
    .map((w) => ({ w })),
  ...'AI isn’t the problem.'.split(' ').map((w) => ({ w })),
  { w: 'Lack', serif: true },
  { w: 'of', serif: true },
  { w: 'direction', serif: true },
  { w: 'is.', serif: true },
]

export function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.manifesto__text .word', {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section" ref={root}>
      <div className="container">
        <Reveal><p className="section-label label">The problem</p></Reveal>
        <p className="manifesto__text">
          {TEXT.map((t, i) => (
            <span key={i}>
              <span className={`word ${t.serif ? 'serif' : ''}`}>{t.w}</span>{' '}
            </span>
          ))}
        </p>
        <div className="manifesto__foot">
          <Reveal>
            <span className="label muted">We observe. AI creates. We engineer the result.</span>
            <span className="manifesto__ar"><Ar>نتأمّل. الذكاء يصنع. ونحن نهندس النتيجة.</Ar></span>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              <BrandWord /> is the layer between your business and AI. We don’t just use it — we direct it, with a
              human eye, real taste and an engineering mindset.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
