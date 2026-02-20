import type { YieldPoint, TimeRange } from '../../types'

interface Props {
  timeRange: TimeRange
  selectedLabel: string | undefined
  currentYield: YieldPoint | undefined
  loading: boolean
}

function rangeLabel(range: TimeRange): string {
  if (range.preset !== 'custom') {
    return `${range.preset} History`
  }
  return `${range.startDate} – ${range.endDate}`
}

export default function YieldCurveHeader({
  timeRange,
  selectedLabel,
  currentYield,
  loading,
}: Props) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <div className="flex items-center gap-3 mb-0.5">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            US Treasury
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs font-bold uppercase tracking-widest text-white">
            {rangeLabel(timeRange)}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-500">FRED / Federal Reserve</span>
        </div>
        {currentYield && (
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {currentYield.yield.toFixed(2)}%
            </span>
            <span className="text-zinc-500 text-sm">{selectedLabel} current yield</span>
          </div>
        )}
      </div>
      {loading && (
        <span className="text-xs text-emerald-500 animate-pulse font-mono mt-1">LOADING...</span>
      )}
    </div>
  )
}
