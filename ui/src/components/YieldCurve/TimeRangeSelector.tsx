import type { TimeRange, TimeRangePreset } from '../../types'
import { DATE_RANGE_PRESETS } from '../consts'
import DateRangePicker from './DateRangePicker'

interface Props {
  timeRange: TimeRange
  onPresetChange: (preset: TimeRangePreset) => void
  onCustomChange: (startDate: string, endDate: string) => void
}

export default function TimeRangeSelector({ timeRange, onPresetChange, onCustomChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-6">
      {DATE_RANGE_PRESETS.map(({ preset, label }) => (
        <button
          key={preset}
          onClick={() => onPresetChange(preset)}
          className={`px-3 py-1.5 rounded text-xs font-bold font-mono transition-colors cursor-pointer ${
            timeRange.preset === preset
              ? 'bg-emerald-500 text-black'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          {label}
        </button>
      ))}
      <span className="text-zinc-700 text-xs font-mono mx-1">|</span>
      <DateRangePicker
        startDate={timeRange.startDate}
        endDate={timeRange.endDate}
        onChange={onCustomChange}
      />
    </div>
  )
}
