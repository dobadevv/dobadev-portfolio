import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the headline as the page h1', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /i build the systems behind commerce/i }),
    ).toBeInTheDocument()
  })

  it('renders the eyebrow and subline copy', () => {
    render(<Hero />)
    expect(screen.getByText(/software engineer · backend \/ fullstack · ho chi minh city/i)).toBeInTheDocument()
    expect(screen.getByText(/~4 years owning end-to-end backend architecture/i)).toBeInTheDocument()
  })

  it('renders the open-to-remote pill badge', () => {
    render(<Hero />)
    expect(screen.getByText(/open to remote & international roles/i)).toBeInTheDocument()
  })

  it('renders a CV download link with the download attribute', () => {
    render(<Hero />)
    const cvLink = screen.getByRole('link', { name: /download cv/i })
    expect(cvLink).toHaveAttribute('href', '/assets/Nguyen-Duy-Anh-CV.pdf')
    expect(cvLink).toHaveAttribute('download')
  })

  it('renders the avatar with descriptive alt text and a retina srcset', () => {
    render(<Hero />)
    const avatar = screen.getByAltText(/portrait of nguyễn duy anh/i)
    expect(avatar).toHaveAttribute('srcset', expect.stringContaining('640w'))
    expect(avatar).toHaveAttribute('srcset', expect.stringContaining('320w'))
  })
})
