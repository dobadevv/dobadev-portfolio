import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { domainCards } from './data'
import styles from './DomainExpertise.module.css'

export function DomainExpertise() {
  return (
    <section id="domains" className="section" aria-labelledby="domains-heading">
      <div className="container">
        <SectionHeading number="01" kicker="Domain expertise" headingId="domains-heading" />
        <div className={styles.grid}>
          {domainCards.map((card, index) => (
            <RevealOnScroll key={card.code} delayMs={index * 80}>
              <article className={styles.card}>
                <p className={styles.code}>{card.code}</p>
                <h3 className={styles.title}>{card.title}</h3>
                <p className={styles.problem}>{card.problem}</p>
                <p className={styles.shipped}>{card.shipped}</p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
