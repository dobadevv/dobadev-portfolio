import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Experience } from './Experience'
import { experienceEntries } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor() {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('Experience', () => {
  it('renders the section heading with number 05 and id="experience"', () => {
    const { container } = render(<Experience />)
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByText('05')).toBeInTheDocument()
    expect(container.querySelector('#experience')).not.toBeNull()
  })

  it('renders one row per experience entry', () => {
    render(<Experience />)
    expect(screen.getAllByRole('listitem')).toHaveLength(experienceEntries.length)
  })

  it('marks only the Finviet entry as CURRENT', () => {
    render(<Experience />)
    expect(screen.getAllByText('CURRENT')).toHaveLength(1)
  })

  it('renders each entry\'s date range, company, role, and description', () => {
    render(<Experience />)
    experienceEntries.forEach((entry) => {
      expect(screen.getByText(entry.dateRange)).toBeInTheDocument()
      expect(screen.getByText(entry.company)).toBeInTheDocument()
      expect(screen.getAllByText(entry.role, { exact: false }).length).toBeGreaterThan(0)
      expect(screen.getByText(entry.description)).toBeInTheDocument()
    })
  })
})
