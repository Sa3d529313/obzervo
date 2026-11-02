import { Reveal } from '../components/Reveal'
import { BrandWord } from '../components/Logo'

const ITEMS = [
  { t: 'Not a traditional studio', d: 'Everything is produced through AI — so it’s faster, and far more affordable.' },
  { t: 'Not just an AI tool', d: 'A human eye — observation, taste, engineering — directs every single output.' },
  { t: 'Engineering mindset', d: 'Identity is treated as a system, not one-off images. Consistency is engineered.' },
  { t: 'AI that finally works', d: 'You don’t just get assets. You get AI that works for your brand from now on.' },
]

export function Principles() {
  return (
    <section className="section principles-section">
      <div className="principles-section__glow" />
      <div className="container">
        <Reveal>
          <p className="section-label label">Why <BrandWord /></p>
          <h2 className="h2">
            The layer between
            <br />
            your business <span className="serif">and AI.</span>
          </h2>
        </Reveal>
        <div className="principles">
          {ITEMS.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.08}>
              <article className="principle glass">
                <span className="principle__n label">0{i + 1}</span>
                <div>
                  <h4>{it.t}</h4>
                  <p>{it.d}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
