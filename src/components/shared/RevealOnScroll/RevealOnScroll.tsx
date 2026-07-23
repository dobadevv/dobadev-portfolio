import type { ReactNode } from 'react'
import { useScrollReveal } from '../../../hooks/useScrollReveal'
import styles from './RevealOnScroll.module.css'

interface RevealOnScrollProps {
  children: ReactNode
  delayMs?: number
}

export function RevealOnScroll({ children, delayMs = 0 }: RevealOnScrollProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${isVisible ? styles.isVisible : styles.isHidden}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}
