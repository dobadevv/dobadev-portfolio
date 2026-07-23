import styles from './Hero.module.css'

const CV_HREF = '/assets/Nguyen-Duy-Anh-CV.pdf'

export function Hero() {
  return (
    <section aria-label="Introduction" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <img
          className={styles.avatar}
          src="/assets/avatar-320.png"
          srcSet="/assets/avatar-320.png 320w, /assets/avatar-640.png 640w"
          sizes="(min-width: 940px) 188px, 20vw"
          width={188}
          height={188}
          alt="Portrait of Nguyễn Duy Anh"
        />
        <div className={styles.text}>
          <p className={styles.eyebrow}>Software Engineer · Backend / Fullstack · Ho Chi Minh City</p>
          <h1 className={styles.headline}>
            I build the systems behind commerce —{' '}
            <span className={styles.accentText}>
              multi-tenant platforms, distribution pipelines, and message infrastructure.
            </span>
          </h1>
          <p className={styles.subline}>
            Nguyễn Duy Anh (&ldquo;Doba&rdquo;) — ~4 years owning end-to-end backend architecture for
            multi-tenant SaaS. I care about correctness under concurrency and systems that are boring to
            operate.
          </p>
          <p className={styles.badge}>
            <span aria-hidden="true">●</span> Open to remote &amp; international roles
          </p>
          <div>
            <a className={styles.cvButton} href={CV_HREF} download>
              ↓ Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
