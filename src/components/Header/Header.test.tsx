import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renders exactly five nav links pointing to the right section ids, in order', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: /section navigation/i })
    const links = within(nav).getAllByRole('link')

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#domains',
      '#projects',
      '#stack',
      '#experience',
      '#contact',
    ])
    expect(links.map((link) => link.textContent)).toEqual([
      'domains',
      'projects',
      'stack',
      'experience',
      'contact',
    ])
  })

  it('renders the avatar with descriptive alt text and the "Doba." wordmark', () => {
    render(<Header />)
    expect(screen.getByAltText(/portrait of nguyễn duy anh/i)).toBeInTheDocument()
    expect(screen.getByText('Doba.')).toBeInTheDocument()
  })

  it('renders as a banner landmark', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
