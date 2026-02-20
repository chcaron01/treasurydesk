import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { presetToRange, getTickStride, getTicks, formatTick } from './chart'
import type { HistoryPoint, TimeRange } from '../types'

// Pin "today" to a fixed date so preset ranges are deterministic
const FIXED_NOW = new Date('2025-02-20T12:00:00')
beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})
afterAll(() => {
  vi.useRealTimers()
})

describe('presetToRange', () => {
  it('1Y preset spans exactly one year back from today', () => {
    const range = presetToRange('1Y')
    expect(range.preset).toBe('1Y')
    expect(range.endDate).toBe('2025-02-20')
    expect(range.startDate).toBe('2024-02-20')
  })

  it('5Y preset spans exactly five years back', () => {
    const range = presetToRange('5Y')
    expect(range.startDate).toBe('2020-02-20')
    expect(range.endDate).toBe('2025-02-20')
  })

  it('10Y preset spans exactly ten years back', () => {
    const range = presetToRange('10Y')
    expect(range.startDate).toBe('2015-02-20')
    expect(range.endDate).toBe('2025-02-20')
  })
})

describe('getTickStride', () => {
  it('returns 1 month stride for 1Y preset', () => {
    expect(getTickStride(presetToRange('1Y'))).toBe(1)
  })

  it('returns 6 month stride for 5Y preset', () => {
    expect(getTickStride(presetToRange('5Y'))).toBe(6)
  })

  it('returns 12 month stride for 10Y preset', () => {
    expect(getTickStride(presetToRange('10Y'))).toBe(12)
  })

  it('returns 1 month stride for custom range <= 18 months', () => {
    const range: TimeRange = { preset: 'custom', startDate: '2024-01-01', endDate: '2025-02-01' }
    expect(getTickStride(range)).toBe(1)
  })

  it('returns 3 month stride for custom range ~30 months', () => {
    const range: TimeRange = { preset: 'custom', startDate: '2022-06-01', endDate: '2025-01-01' }
    expect(getTickStride(range)).toBe(3)
  })

  it('returns 6 month stride for custom range ~48 months', () => {
    const range: TimeRange = { preset: 'custom', startDate: '2021-01-01', endDate: '2025-01-01' }
    expect(getTickStride(range)).toBe(6)
  })

  it('returns 12 month stride for custom range > 72 months', () => {
    const range: TimeRange = { preset: 'custom', startDate: '2015-01-01', endDate: '2025-01-01' }
    expect(getTickStride(range)).toBe(12)
  })
})

describe('getTicks', () => {
  const data: HistoryPoint[] = [
    { date: '2024-01-05', yield: 4.5 },
    { date: '2024-01-20', yield: 4.6 },
    { date: '2024-02-10', yield: 4.7 },
    { date: '2024-03-15', yield: 4.8 },
    { date: '2024-04-01', yield: 4.9 },
  ]

  it('returns one tick per matching month bucket', () => {
    // stride=1: months 1,2,3,4 all match (month-1) % 1 === 0
    const ticks = getTicks(data, 1)
    expect(ticks).toHaveLength(4)
  })

  it('deduplicates multiple points in the same month', () => {
    const ticks = getTicks(data, 1)
    // Jan appears twice in data, should only be one tick
    const janTicks = ticks.filter((t) => t.startsWith('2024-01'))
    expect(janTicks).toHaveLength(1)
  })

  it('returns only the first point per qualifying month', () => {
    const ticks = getTicks(data, 1)
    expect(ticks[0]).toBe('2024-01-05') // first Jan entry
  })

  it('returns empty array for empty data', () => {
    expect(getTicks([], 1)).toHaveLength(0)
  })

  it('filters to every 3rd month when stride=3', () => {
    // months 1 and 4 satisfy (month-1) % 3 === 0
    const ticks = getTicks(data, 3)
    expect(ticks.every((t) => ['01', '04', '07', '10'].includes(t.slice(5, 7)))).toBe(true)
  })
})

describe('formatTick', () => {
  it('formats yearly ticks (stride >= 12) as 4-digit year', () => {
    const result = formatTick('2024-06-01', 12)
    expect(result).toBe('2024')
  })

  it('formats quarterly ticks (stride 3-11) as "Mon YY"', () => {
    const result = formatTick('2024-06-01', 3)
    expect(result).toMatch(/Jun\s*24/)
  })

  it('formats monthly ticks (stride 1-2) as abbreviated month name', () => {
    const result = formatTick('2024-06-01', 1)
    expect(result).toMatch(/Jun/)
  })

  it('formats stride=6 as "Mon YY"', () => {
    const result = formatTick('2023-01-15', 6)
    expect(result).toMatch(/Jan\s*23/)
  })
})
