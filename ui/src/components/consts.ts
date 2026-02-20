import type { TimeRangePreset } from '../types'

export const TERMS = [
  { id: 'DGS1MO', label: '1M' },
  { id: 'DGS3MO', label: '3M' },
  { id: 'DGS6MO', label: '6M' },
  { id: 'DGS1', label: '1Y' },
  { id: 'DGS2', label: '2Y' },
  { id: 'DGS3', label: '3Y' },
  { id: 'DGS5', label: '5Y' },
  { id: 'DGS7', label: '7Y' },
  { id: 'DGS10', label: '10Y' },
  { id: 'DGS20', label: '20Y' },
  { id: 'DGS30', label: '30Y' },
]

export const DATE_RANGE_PRESETS: { preset: TimeRangePreset; label: string }[] = [
  { preset: '1Y', label: '1Y' },
  { preset: '5Y', label: '5Y' },
  { preset: '10Y', label: '10Y' },
]
