import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  number: string
  kicker: string
  headingId: string
}

export function SectionHeading({ number, kicker, headingId }: SectionHeadingProps) {
  return (
    <h2 id={headingId} className={styles.heading}>
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      {kicker}
    </h2>
  )
}
