import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'

// Replaces the system arrow: a solid dot sits exactly on the pointer, a thin outline ring
// eases after it. Over links and buttons the ring opens and the dot tightens.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dot.current || !ring.current || window.matchMedia('(hover: none)').matches) return
    document.documentElement.classList.add('has-custom-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3.out' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' })
    let shown = false

    const move = (e: PointerEvent) => {
      if (!shown) {
        // Appear in place on the first move rather than sliding in from the corner.
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        document.documentElement.classList.add('cursor-visible')
        shown = true
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      const interactive = !!(e.target as HTMLElement).closest('a, button, [data-cursor]')
      ring.current?.classList.toggle('is-hover', interactive)
      dot.current?.classList.toggle('is-hover', interactive)
    }
    const leave = () => {
      document.documentElement.classList.remove('cursor-visible')
      shown = false
    }

    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-custom-cursor', 'cursor-visible')
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
