import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeading } from './SectionHeading'

describe('SectionHeading', () => {
  it('renders the kicker as an h2 with the given id', () => {
    render(<SectionHeading number="01" kicker="Domain expertise" headingId="domains-heading" />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Domain expertise' })
    expect(heading).toHaveAttribute('id', 'domains-heading')
  })

  it('renders the section number as decorative (not part of the accessible name)', () => {
    render(<SectionHeading number="01" kicker="Domain expertise" headingId="domains-heading" />)
    expect(screen.getByText('01')).toHaveAttribute('aria-hidden', 'true')
  })
})
