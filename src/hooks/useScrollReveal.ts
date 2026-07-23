import { useEffect, useRef, useState } from 'react'

interface ScrollRevealResult<T> {
  ref: React.RefObject<T | null>
  isVisible: boolean
}

export function useScrollReveal<T extends HTMLElement>(): ScrollRevealResult<T> {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
