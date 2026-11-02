import type { SVGProps } from 'react'

// The Obzervo mark, rebuilt as exact geometry: three identical pills lying on the sides
// of an equilateral ▽, 120° apart around one centre. Proportions follow the finalized
// artwork (Downloads/Obzervo.png); the original's slightly longer top pill and 54° legs
// were evened out so the mark is perfectly symmetric and spins cleanly.
export const CENTER = { x: 676, y: 580 }
export const PILL_WIDTH = 217
const INRADIUS = 220.5 // centre → each pill's axis
const HALF_LENGTH = 115 // pill midpoint → cap centre

export const PILLS = [0, 120, 240].map((deg) => {
  // Top pill is horizontal above the centre; the others are that pill rotated about CENTER.
  const a = (deg * Math.PI) / 180
  const rot = (px: number, py: number) => ({
    x: CENTER.x + px * Math.cos(a) - py * Math.sin(a),
    y: CENTER.y + px * Math.sin(a) + py * Math.cos(a),
  })
  const p1 = rot(-HALF_LENGTH, -INRADIUS)
  const p2 = rot(HALF_LENGTH, -INRADIUS)
  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }
})

// Square viewBox centred exactly on CENTER, so CSS/GSAP rotation (50% 50%) pivots on the mark's true centre.
const R = 360
const VIEWBOX = `${CENTER.x - R} ${CENTER.y - R} ${R * 2} ${R * 2}`

export function LogoMark({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEWBOX} className={className} aria-hidden="true" {...rest}>
      <g stroke="currentColor" strokeWidth={PILL_WIDTH} strokeLinecap="round">
        {PILLS.map((p, i) => (
          <line key={i} className="logo-pill" {...p} />
        ))}
      </g>
    </svg>
  )
}

// The name set exactly like the header wordmark, for every mention of "Obzervo" in copy.
export function BrandWord() {
  return <span className="brand-word">Obzervo</span>
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`wordmark ${className ?? ''}`}>
      <LogoMark className="wordmark__mark" />
      <span className="wordmark__text">Obzervo</span>
    </span>
  )
}
