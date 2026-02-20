import { useQuery } from '@tanstack/react-query'
import { fetchYieldHistory } from '../api'
import type { TimeRange } from '../types'

export function useYieldHistory(seriesId: string, range: TimeRange) {
  return useQuery({
    queryKey: ['yieldHistory', seriesId, range.startDate, range.endDate],
    queryFn: () => fetchYieldHistory(seriesId, range),
  })
}
