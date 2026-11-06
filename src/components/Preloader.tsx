import { useCallback, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { LogoMark } from './Logo'
import { Ar } from './Arabic'
import { LiquidGlassLogo } from './liquid-glass-logo'

type Props = {
  onReveal: () => void // curtain starts lifting — the hero intro can begin underneath
  onDone: () => void // logo has landed in the header — safe to unmount
}

// Glass settings shared by the canvas and the size of the SVG that takes over from it.
const LOGO_SIZE = 220 // plate edge in px before the component's responsive fit
const LOGO_SCALE = 0.72 // logo edge as a fraction of the plate
const GLASS_END = 1.8 // seconds until the glass has cleared and only the logo is left
const SPIN = GLASS_END + 0.1 // the bare mark turns a third while the name rises in
const NAME_OUT = SPIN + 1.5 // the name fades before the mark heads for the header
const FLY = NAME_OUT + 0.3
const NAME_GAP = 0.16 // space between mark and name, as a fraction of the mark

// Final logo edge as the component draws it: the plate edge after its fit, times LOGO_SCALE.
function restingSize(width: number, height: number) {
  const fit = Math.min(1, width / (LOGO_SIZE * 1.9), height / (LOGO_SIZE * 1.5))
  return LOGO_SIZE * fit * LOGO_SCALE
}

// A drop of liquid glass forms a tile around the mark, then clears, leaving the bare mark.
// At that moment a pixel-matched SVG takes over: it turns a third while the name rises in
// underneath, the name fades, and the mark flies into the header logo's exact spot while
// the curtain lifts.
export function Preloader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const curtain = useRef<HTMLDivElement>(null)
  const glass = useRef<HTMLDivElement>(null)
  const mark = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const name = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const navMark = document.querySelector<HTMLElement>('.nav .wordmark__mark')
    if (navMark) navMark.style.opacity = '0'

    const size = restingSize(root.current!.clientWidth, root.current!.clientHeight)
    const gap = size * NAME_GAP
    gsap.set(mark.current, { width: size, height: size, opacity: 0 })
    gsap.set(name.current, { fontSize: Math.max(24, size * 0.24), opacity: 0 })
    gsap.set('.preloader__name > span', { yPercent: 110 })
    // Mark and name sit as one centred pair: the mark lifts by half the name's height (plus gap).
    const lift = () => -(gap + name.current!.offsetHeight) / 2

    const ctx = gsap.context(() => {
      const n = { v: 0 }
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (navMark) navMark.style.opacity = '1'
          onDone()
        },
      })
      tl.to(n, {
        v: 100,
        duration: GLASS_END,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, '0')
        },
      }, 0)
        .to(['.preloader__word', '.preloader__count'], { opacity: 0, duration: 0.4 }, GLASS_END - 0.2)
        // The glass has cleared: swap the canvas for the identical SVG mark.
        .set(mark.current, { opacity: 1 }, GLASS_END)
        .to(glass.current, { opacity: 0, duration: 0.15, ease: 'none' }, GLASS_END)
        .to(mark.current, { rotate: 120, y: lift, duration: 1.1, ease: 'expo.inOut' }, SPIN)
        .set(name.current, { y: () => size / 2 + lift() + gap, opacity: 1 }, SPIN)
        .to('.preloader__name > span', { yPercent: 0, duration: 1, ease: 'expo.out' }, SPIN + 0.35)
        .to(name.current, { opacity: 0, filter: 'blur(6px)', duration: 0.4, ease: 'power2.in' }, NAME_OUT)
        .add(() => onReveal(), FLY + 0.05)
        // A transform slide (GPU-composited) instead of a clip-path wipe, which had to repaint
        // the full screen every frame while the hero started up underneath.
        .to(curtain.current, { yPercent: -100, duration: 1.3, ease: 'power4.inOut' }, FLY + 0.05)
        // Measured at this moment so it lands wherever the header logo actually is.
        // Each third of a turn looks identical at rest, so it lands matching the header mark.
        .to(mark.current, {
          x: () => flight(mark.current, navMark).x,
          y: () => flight(mark.current, navMark).y,
          scale: () => flight(mark.current, navMark).scale,
          rotate: 240,
          duration: 1.2,
          ease: 'expo.inOut',
        }, FLY)
      timeline.current = tl
    }, root)

    // Never hold the page if the logo image or WebGL stalls.
    const failsafe = window.setTimeout(() => timeline.current?.play(), 2500)
    return () => {
      window.clearTimeout(failsafe)
      timeline.current = null
      ctx.revert()
    }
  }, [onReveal, onDone])

  // The component's clock starts when its logo has loaded; start ours at the same moment.
  const start = useCallback(() => timeline.current?.play(), [])

  return (
    <div className="preloader" ref={root}>
      <div className="preloader__curtain" ref={curtain}>
        <span className="preloader__word">Observing <Ar>· نتأمّل</Ar></span>
        <span className="preloader__count" ref={count}>000</span>
      </div>
      <div className="preloader__glass" ref={glass}>
        <LiquidGlassLogo
          logo={`${import.meta.env.BASE_URL}logo.svg`}
          ending="logo"
          logoSize={LOGO_SIZE}
          logoScale={LOGO_SCALE}
          logoColor="#f3f6f7"
          logoRelief={0} // flat, exactly like the SVG that takes over
          background="#02070A"
          tileColor="#061722"
          aria-label="Obzervo"
          onReady={start}
        />
      </div>
      <div className="preloader__name" ref={name} aria-hidden="true">
        <span className="brand-word">Obzervo</span>
      </div>
      <div className="preloader__mark" ref={mark}>
        <LogoMark />
      </div>
    </div>
  )
}

// Offset and scale that move `from` (untransformed) onto `to`, centre to centre.
function flight(from: HTMLElement | null, to: HTMLElement | null) {
  if (!from || !to) return { x: 0, y: -window.innerHeight, scale: 0.3 }
  const prev = from.style.transform
  from.style.transform = 'none'
  const a = from.getBoundingClientRect()
  from.style.transform = prev
  const b = to.getBoundingClientRect()
  return {
    x: b.left + b.width / 2 - (a.left + a.width / 2),
    y: b.top + b.height / 2 - (a.top + a.height / 2),
    scale: b.width / a.width,
  }
}
