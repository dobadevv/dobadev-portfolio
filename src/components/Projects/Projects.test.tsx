import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Projects } from './Projects'
import { projects } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor() {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('Projects', () => {
  it('renders the section heading with number 02 and id="projects"', () => {
    const { container } = render(<Projects />)
    expect(screen.getByRole('heading', { level: 2, name: 'My projects' })).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(container.querySelector('#projects')).not.toBeNull()
  })

  it('renders one article per project', () => {
    render(<Projects />)
    expect(screen.getAllByRole('article')).toHaveLength(projects.length)
  })

  it('opens each project link safely, with correct href, subtitle, description, and tags', () => {
    render(<Projects />)
    projects.forEach((project) => {
      const link = screen.getByRole('link', { name: project.title })
      expect(link).toHaveAttribute('href', project.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(screen.getByText(project.subtitle)).toBeInTheDocument()
      expect(screen.getByText(project.description)).toBeInTheDocument()
      project.tags.forEach((tag) => {
        expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
      })
    })
  })

  it('renders a trailing "more projects in progress" placeholder with no link', () => {
    render(<Projects />)
    const placeholder = screen.getByText(/more projects in progress/i)
    expect(placeholder.querySelector('a')).toBeNull()
  })
})
