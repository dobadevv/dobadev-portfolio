import styles from './Header.module.css'

const NAV_LINKS = [
  { label: 'domains', href: '#domains' },
  { label: 'projects', href: '#projects' },
  { label: 'stack', href: '#stack' },
  { label: 'experience', href: '#experience' },
  { label: 'contact', href: '#contact' },
]

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.brand} href="#main-content">
          <img
            className={styles.avatar}
            src="/assets/avatar-96.png"
            width={40}
            height={40}
            alt="Portrait of Nguyễn Duy Anh"
          />
          <span className={styles.wordmark}>Doba.</span>
        </a>
        <nav className={styles.nav} aria-label="Section navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
