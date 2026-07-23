import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import { contactEntries } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('Contact', () => {
  it('renders the section heading with number 06 and id="contact"', () => {
    const { container } = render(<Contact />)
    expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByText('06')).toBeInTheDocument()
    expect(container.querySelector('#contact')).not.toBeNull()
  })

  it('renders the closing heading and location line', () => {
    render(<Contact />)
    expect(screen.getByText(/let.s build something that stays boring to run/i)).toBeInTheDocument()
    expect(screen.getByText(/based in ho chi minh city/i)).toBeInTheDocument()
  })

  it('renders one card per contact entry with the correct href', () => {
    render(<Contact />)
    contactEntries.forEach((entry) => {
      const link = screen.getByRole('link', { name: entry.value })
      expect(link).toHaveAttribute('href', entry.href)
    })
  })

  it('marks only external contact links with target and rel', () => {
    render(<Contact />)
    contactEntries.forEach((entry) => {
      const link = screen.getByRole('link', { name: entry.value })
      if (entry.external) {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      } else {
        expect(link).not.toHaveAttribute('target')
      }
    })
  })
})
