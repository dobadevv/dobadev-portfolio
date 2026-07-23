import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stack } from './Stack'
import { stackGroups } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('Stack', () => {
  it('renders the section heading with number 03 and id="stack"', () => {
    const { container } = render(<Stack />)
    expect(screen.getByRole('heading', { level: 2, name: 'Stack' })).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(container.querySelector('#stack')).not.toBeNull()
  })

  it('renders one group per stack category with its label', () => {
    render(<Stack />)
    expect(screen.getAllByRole('article')).toHaveLength(stackGroups.length)
    stackGroups.forEach((group) => {
      expect(screen.getByRole('heading', { level: 3, name: group.label })).toBeInTheDocument()
    })
  })

  it('renders every tag chip within its group', () => {
    render(<Stack />)
    stackGroups.forEach((group) => {
      group.items.forEach((item) => {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0)
      })
    })
  })
})
