export interface YieldPoint {
  label: string
  months: number
  yield: number
}

export interface HistoryPoint {
  date: string
  yield: number
}

export type TimeRangePreset = '1Y' | '5Y' | '10Y'

export interface TimeRange {
  preset: TimeRangePreset | 'custom'
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}

export interface Order {
  id: string
  term: string
  months: number
  amount: number
  yield: number
  createdAt: string
}
