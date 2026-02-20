import { describe, it, expect } from 'vitest'
import { toDate, toStr, formatDateShort, formatDateTime } from './date'

describe('toDate', () => {
  it('parses a YYYY-MM-DD string as local midnight', () => {
    const d = toDate('2024-03-15')
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth()).toBe(2) // 0-indexed
    expect(d.getDate()).toBe(15)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
  })

  it('returns a Date instance', () => {
    expect(toDate('2024-01-01')).toBeInstanceOf(Date)
  })
})

describe('toStr', () => {
  it('formats a Date as YYYY-MM-DD', () => {
    const d = new Date('2024-06-20T00:00:00')
    expect(toStr(d)).toBe('2024-06-20')
  })

  it('is the inverse of toDate for date-only values', () => {
    const original = '2023-11-05'
    expect(toStr(toDate(original))).toBe(original)
  })
})

describe('formatDateShort', () => {
  it('formats a date string as "Mon D, YYYY"', () => {
    const result = formatDateShort('2024-01-15')
    // e.g. "Jan 15, 2024"
    expect(result).toMatch(/Jan\s+15,\s+2024/)
  })

  it('handles end-of-year dates', () => {
    const result = formatDateShort('2023-12-31')
    expect(result).toMatch(/Dec\s+31,\s+2023/)
  })
})

describe('formatDateTime', () => {
  it('formats an ISO timestamp with month, day, hour, minute', () => {
    // Use a fixed UTC timestamp: 2024-02-14T18:30:00.000Z
    // Result depends on system timezone; verify components present
    const result = formatDateTime('2024-02-14T18:30:00.000Z')
    expect(result).toMatch(/Feb/)
    expect(result).toMatch(/14/)
    // Should include a time component (e.g. "06:30 PM" or "18:30")
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })
})
