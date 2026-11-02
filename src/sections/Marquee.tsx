import { LogoMark } from '../components/Logo'

const ITEMS = ['AI brand identity', 'AI visuals', 'AI-engineered websites', 'AI brand systems', 'AI audit & fix']

// Endless strip: two identical halves, each wider than any screen; the track slides by
// exactly one half and restarts, so the loop never shows an end or a seam.
export function Marquee() {
  const half = [...ITEMS, ...ITEMS, ...ITEMS]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {half.map((t, i) => (
              <span className="marquee__item" key={i}>
                {t}
                <LogoMark />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
