import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { contactEntries } from './data'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <SectionHeading number="06" kicker="Contact" headingId="contact-heading" />
        <h3 className={styles.heading}>Let&rsquo;s build something that stays boring to run.</h3>
        <p className={styles.location}>Based in Ho Chi Minh City · open to remote &amp; international roles.</p>
        <div className={styles.grid}>
          {contactEntries.map((entry, index) => (
            <RevealOnScroll key={entry.label} delayMs={index * 60}>
              <article className={styles.card}>
                <p className={styles.label}>{entry.label}</p>
                <a
                  className={styles.value}
                  href={entry.href}
                  {...(entry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {entry.value}
                </a>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
