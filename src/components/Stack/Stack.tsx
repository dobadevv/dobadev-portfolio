import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { stackGroups } from './data'
import styles from './Stack.module.css'

export function Stack() {
  return (
    <section id="stack" className="section" aria-labelledby="stack-heading">
      <div className="container">
        <SectionHeading number="03" kicker="Stack" headingId="stack-heading" />
        <div className={styles.grid}>
          {stackGroups.map((group, index) => (
            <RevealOnScroll key={group.label} delayMs={index * 60}>
              <article className={styles.card}>
                <h3 className={styles.label}>{group.label}</h3>
                <ul className={styles.chips}>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
