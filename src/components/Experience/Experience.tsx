import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { experienceEntries } from './data'
import styles from './Experience.module.css'

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="container">
        <SectionHeading number="05" kicker="Experience" headingId="experience-heading" />
        <ol className={styles.timeline}>
          {experienceEntries.map((entry, index) => (
            <li key={entry.company} className={styles.row}>
              <RevealOnScroll delayMs={index * 60}>
                <div className={styles.rowInner}>
                  <div className={styles.dateCell}>
                    <p className={styles.date}>{entry.dateRange}</p>
                    {entry.current && <span className={styles.currentBadge}>CURRENT</span>}
                  </div>
                  <div>
                    <p className={styles.companyRole}>
                      <span className={styles.company}>{entry.company}</span> · {entry.role}
                    </p>
                    <p className={styles.description}>{entry.description}</p>
                  </div>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
