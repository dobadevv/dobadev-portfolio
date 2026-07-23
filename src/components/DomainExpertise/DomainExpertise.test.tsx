import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DomainExpertise } from './DomainExpertise'
import { domainCards } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('DomainExpertise', () => {
  it('renders the section heading with number 01 and id="domains"', () => {
    const { container } = render(<DomainExpertise />)
    expect(screen.getByRole('heading', { level: 2, name: 'Domain expertise' })).toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(container.querySelector('#domains')).not.toBeNull()
  })

  it('renders one article per domain card', () => {
    render(<DomainExpertise />)
    expect(screen.getAllByRole('article')).toHaveLength(domainCards.length)
  })

  it('renders each card code, title, problem, and shipped line', () => {
    render(<DomainExpertise />)
    domainCards.forEach((card) => {
      expect(screen.getByText(card.code)).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3, name: card.title })).toBeInTheDocument()
      expect(screen.getByText(card.problem)).toBeInTheDocument()
      expect(screen.getByText(card.shipped)).toBeInTheDocument()
    })
  })
})
