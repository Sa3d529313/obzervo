import { useEffect } from 'react'

// Liquid-glass refraction. Chromium can run an SVG filter inside `backdrop-filter`,
// so glass panels marked `.glass--liquid` bend whatever is behind them (including the
// live WebGL gradient). Other browsers keep the plain frosted glass.
// (liquid-glass-js was considered, but it snapshots the page with html2canvas and
// can't refract a live, animated canvas.)
export function LiquidGlassFilter() {
  useEffect(() => {
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands
    if (brands?.some((b) => b.brand === 'Chromium')) document.documentElement.classList.add('supports-liquid')
  }, [])

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="liquid-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="46" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}
