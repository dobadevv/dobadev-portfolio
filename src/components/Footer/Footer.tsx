import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>© 2026 Nguyễn Duy Anh (Doba)</p>
        <p>Built with structure over decoration.</p>
      </div>
    </footer>
  )
}
