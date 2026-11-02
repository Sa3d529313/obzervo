import { Reveal } from '../components/Reveal'
import { Arrow } from '../components/Button'

const SERVICES = [
  { name: 'AI brand identity', desc: 'Visual character, palette, type and a style guide built to be read by people and by models.' },
  { name: 'AI visuals', desc: 'Product shots, campaign images and social content that stay consistent across everything.' },
  { name: 'AI-engineered websites', desc: 'Custom, interactive, high-end sites built with AI-assisted engineering. Never templates.' },
  { name: 'AI brand systems', desc: 'You keep the system — prompts, styles, guidelines — so future AI output stays on-brand.' },
  { name: 'AI audit & fix', desc: 'We take your existing AI output, find where it breaks, and rebuild it properly.' },
]

export function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="services__head">
          <Reveal>
            <p className="section-label label">Services</p>
            <h2 className="h2">
              Everything your brand
              <br />
              needs, <span className="serif">directed.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p>Faster and more affordable than a traditional studio. More taste and system than any AI tool.</p>
          </Reveal>
        </div>
        <div className="services__list">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05} y={24}>
              <a
                className="service"
                href="#contact"
                data-cursor
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                }}
              >
                <span className="service__idx label">0{i + 1}</span>
                <span className="service__name">{s.name}</span>
                <span className="service__desc">{s.desc}</span>
                <span className="service__icon"><Arrow /></span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
