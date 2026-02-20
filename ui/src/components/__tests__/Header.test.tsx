import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  it('renders the brand name', () => {
    render(<Header />)
    expect(screen.getByText('Treasury Desk')).toBeInTheDocument()
  })

  it('renders a formatted date/time string', () => {
    render(<Header />)
    // The header displays something like "Fri, Feb 20, 12:00 PM EST"
    // Verify it contains an abbreviated weekday name
    const header = screen.getByRole('banner')
    expect(header.textContent).toMatch(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/)
  })

  it('renders a time-zone abbreviation', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    // Should contain something like "EST", "PST", "UTC", etc.
    expect(header.textContent).toMatch(/[A-Z]{2,5}/)
  })

  it('renders a colon-separated time', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header.textContent).toMatch(/\d{1,2}:\d{2}/)
  })
})
