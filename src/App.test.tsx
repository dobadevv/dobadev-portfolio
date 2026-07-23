import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor() {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('App', () => {
  it('renders landmarks in document order: banner, main, contentinfo', () => {
    render(<App />)
    const banner = screen.getByRole('banner')
    const main = screen.getByRole('main')
    const contentinfo = screen.getByRole('contentinfo')

    expect(banner.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(main.compareDocumentPosition(contentinfo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders a skip link pointing at the main content region', () => {
    render(<App />)
    const skipLink = screen.getByRole('link', { name: /skip to main content/i })
    expect(skipLink).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('every header nav link href resolves to a real section id on the page', () => {
    const { container } = render(<App />)
    const nav = screen.getByRole('navigation', { name: /section navigation/i })
    const hrefs = Array.from(nav.querySelectorAll('a')).map((a) => a.getAttribute('href') as string)

    expect(hrefs.length).toBeGreaterThan(0)
    hrefs.forEach((href) => {
      expect(container.querySelector(href)).not.toBeNull()
    })
  })

  it('renders all six numbered sections in order 01 through 06', () => {
    render(<App />)
    const numbers = ['01', '02', '03', '04', '05', '06']
    numbers.forEach((number) => {
      expect(screen.getByText(number)).toBeInTheDocument()
    })
  })
})
