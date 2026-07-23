import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RevealOnScroll } from './RevealOnScroll'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor() {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('RevealOnScroll', () => {
  it('renders its children so content is visible without JS running', () => {
    render(
      <RevealOnScroll>
        <p>Hard-problem framing</p>
      </RevealOnScroll>,
    )
    expect(screen.getByText('Hard-problem framing')).toBeInTheDocument()
  })

  it('applies the requested transition delay', () => {
    render(
      <RevealOnScroll delayMs={160}>
        <p>Delayed card</p>
      </RevealOnScroll>,
    )
    const wrapper = screen.getByText('Delayed card').parentElement
    expect(wrapper).toHaveStyle({ transitionDelay: '160ms' })
  })
})
