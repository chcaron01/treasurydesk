import type { HistoryPoint, TimeRange, TimeRangePreset } from '../types'

export function presetToRange(preset: TimeRangePreset): TimeRange {
  const end = new Date()
  const start = new Date(end)
  if (preset === '1Y') {
    start.setFullYear(end.getFullYear() - 1)
  }
  if (preset === '5Y') {
    start.setFullYear(end.getFullYear() - 5)
  }
  if (preset === '10Y') {
    start.setFullYear(end.getFullYear() - 10)
  }
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { preset, startDate: fmt(start), endDate: fmt(end) }
}

export function getTickStride(range: TimeRange): number {
  const months =
    (new Date(range.endDate).getTime() - new Date(range.startDate).getTime()) /
    (1000 * 60 * 60 * 24 * 30.44)
  if (months <= 18) {
    return 1
  }
  if (months <= 36) {
    return 3
  }
  if (months <= 72) {
    return 6
  }
  return 12
}

export function getTicks(data: HistoryPoint[], stride: number): string[] {
  const seen = new Set<string>()
  return data
    .filter((p) => {
      const month = parseInt(p.date.slice(5, 7), 10)
      const bucketKey = p.date.slice(0, 7)
      if ((month - 1) % stride === 0 && !seen.has(bucketKey)) {
        seen.add(bucketKey)
        return true
      }
      return false
    })
    .map((p) => p.date)
}

export function formatTick(date: string, stride: number): string {
  const d = new Date(date + 'T00:00:00')
  if (stride >= 12) {
    return d.toLocaleDateString('en-US', { year: 'numeric' })
  }
  if (stride >= 3) {
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }
  return d.toLocaleDateString('en-US', { month: 'short' })
}
