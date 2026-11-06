import { Reveal } from '../components/Reveal'
import { Button } from '../components/Button'
import { BrandWord, Wordmark } from '../components/Logo'
import { Ar } from '../components/Arabic'

// TODO: replace placeholder contact details with the real ones.
const EMAIL = 'hello@obzervo.com'

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__glow" />
      <div className="container">
        <Reveal>
          <p className="contact__ar"><Ar>خلّينا نحكي</Ar></p>
        </Reveal>
        <Reveal>
          <h2 className="contact__title">
            Let’s look closely
            <br />
            at your <span className="serif">brand.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="contact__sub">
            Tell us what you’re building and where AI is letting you down. We’ll reply within one working day.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="contact__ctas">
            <Button href={`mailto:${EMAIL}`}>{EMAIL}</Button>
            <Button href={`mailto:${EMAIL}?subject=AI%20audit`} variant="glass" arrow={false}>Request an AI audit</Button>
          </div>
        </Reveal>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer__card glass">
            <div className="footer__grid">
              <div>
                <Wordmark />
                <p className="muted" style={{ maxWidth: 280, marginTop: 16 }}>
                  AI creative design &amp; engineering studio, based in Palestine.
                </p>
              </div>
              <div>
                <h5 className="label">Studio</h5>
                <ul>
                  <li><a href="#method">Method</a></li>
                  <li><a href="#services">Services</a></li>
                  <li><a href="#difference">Difference</a></li>
                </ul>
              </div>
              <div>
                <h5 className="label">Services</h5>
                <ul>
                  <li><a href="#services">Brand identity</a></li>
                  <li><a href="#services">AI visuals</a></li>
                  <li><a href="#services">Websites</a></li>
                </ul>
              </div>
              <div>
                <h5 className="label">Social</h5>
                <ul>
                  <li><a href="#">Instagram</a></li>
                  <li><a href="#">LinkedIn</a></li>
                  <li><a href="#">Behance</a></li>
                </ul>
              </div>
            </div>
            <p className="footer__big" aria-hidden="true">Obzervo</p>
          </div>
          <div className="footer__bottom label">
            <span>© {new Date().getFullYear()} <BrandWord /> · <Ar>صُنع في فلسطين</Ar></span>
            <span>We observe. AI creates. We engineer the result.</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
