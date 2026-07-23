import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import styles from './HowIWork.module.css'

export function HowIWork() {
  return (
    <section id="how-i-work" className="section" aria-labelledby="how-i-work-heading">
      <div className="container">
        <SectionHeading number="04" kicker="How I work" headingId="how-i-work-heading" />
        <RevealOnScroll>
          <p className={styles.statement}>
            I care about correctness under concurrency, clear boundaries between services, and systems that are boring
            to operate — the kind you don&rsquo;t get paged about at 3am.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
