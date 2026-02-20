import { describe, it, expect } from 'vitest'
import { formatCurrency } from './format'

describe('formatCurrency', () => {
  it('formats a whole number as USD with no decimals', () => {
    expect(formatCurrency(1000)).toBe('$1,000')
  })

  it('rounds fractional amounts', () => {
    expect(formatCurrency(1234.99)).toBe('$1,235')
  })

  it('formats large amounts with commas', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('formats small amounts', () => {
    expect(formatCurrency(500)).toBe('$500')
  })
})
