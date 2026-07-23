import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders as a contentinfo landmark', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the copyright and tagline text', () => {
    render(<Footer />)
    expect(screen.getByText('© 2026 Nguyễn Duy Anh (Doba)')).toBeInTheDocument()
    expect(screen.getByText('Built with structure over decoration.')).toBeInTheDocument()
  })
})
