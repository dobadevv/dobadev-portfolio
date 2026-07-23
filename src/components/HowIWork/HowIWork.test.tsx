import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HowIWork } from './HowIWork'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('HowIWork', () => {
  it('renders the section heading with number 04 and id="how-i-work"', () => {
    const { container } = render(<HowIWork />)
    expect(screen.getByRole('heading', { level: 2, name: 'How I work' })).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(container.querySelector('#how-i-work')).not.toBeNull()
  })

  it('renders the statement text', () => {
    render(<HowIWork />)
    expect(
      screen.getByText(/i care about correctness under concurrency, clear boundaries between services/i),
    ).toBeInTheDocument()
  })
})
