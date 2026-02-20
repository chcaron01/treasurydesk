import { useEffect, useState } from 'react'
import type React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TimeRange } from '../../types'
import { TERMS } from '../consts'
import { presetToRange, getTickStride, getTicks, formatTick } from '../../utils/chart'
import { useYields } from '../../api/useYields'
import { useYieldHistory } from '../../api/useYieldHistory'
import YieldCurveHeader from './YieldCurveHeader'
import SeriesSelector from './SeriesSelector'
import TimeRangeSelector from './TimeRangeSelector'

interface TooltipPayload {
  value: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 shadow-xl">
      <p className="text-zinc-400 text-xs mb-0.5 font-mono">{label}</p>
      <p className="text-emerald-400 text-base font-bold font-mono">
        {payload[0].value.toFixed(2)}%
      </p>
    </div>
  )
}

export default function YieldCurve() {
  const [selectedSeries, setSelectedSeries] = useState('DGS10')
  const [timeRange, setTimeRange] = useState<TimeRange>(() => presetToRange('1Y'))
  const [ticks, setTicks] = useState<string[]>([])

  const { data: snapshot = [] } = useYields()

  const {
    data: history = [],
    isLoading: loadingHistory,
    isError,
    error,
  } = useYieldHistory(selectedSeries, timeRange)

  const setChartRef = (el: HTMLDivElement | null) => {
    if (el) {
      el.addEventListener('mousedown', (e) => e.preventDefault())
    }
  }

  const selected = TERMS.find((s) => s.id === selectedSeries)
  const currentYield = snapshot.find((y) => y.label === selected?.label)
  const tickStride = getTickStride(timeRange)

  useEffect(() => {
    if (!loadingHistory) {
      setTicks(getTicks(history, tickStride))
    }
  }, [history, tickStride])

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Failed to load history'
    : null

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
      <YieldCurveHeader
        timeRange={timeRange}
        selectedLabel={selected?.label}
        currentYield={currentYield}
        loading={loadingHistory}
      />

      <div className="flex items-start justify-between">
        <SeriesSelector selectedSeries={selectedSeries} onChange={setSelectedSeries} />
        <TimeRangeSelector
          timeRange={timeRange}
          onPresetChange={(preset) => setTimeRange(presetToRange(preset))}
          onCustomChange={(start, end) =>
            setTimeRange({ preset: 'custom', startDate: start, endDate: end })
          }
        />
      </div>

      {errorMessage && (
        <div className="bg-red-950/40 border border-red-800/50 rounded p-3 text-red-400 text-sm font-mono mb-4">
          ERROR: {errorMessage}
        </div>
      )}

      {!errorMessage && (
        <div
          ref={setChartRef as unknown as React.RefCallback<HTMLDivElement>}
          style={{ userSelect: 'none' }}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={history} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#3f3f46' }}
                tickLine={false}
                ticks={ticks}
                tickFormatter={(date: string) => formatTick(date, tickStride)}
              />
              <YAxis
                tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
                domain={['auto', 'auto']}
                width={65}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="yield"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#yieldGradient)"
                dot={false}
                activeDot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!errorMessage && !loadingHistory && history.length === 0 && (
        <div className="h-[260px] flex items-center justify-center text-zinc-600 font-mono text-sm">
          NO DATA
        </div>
      )}
    </div>
  )
}
