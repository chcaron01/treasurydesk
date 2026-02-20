import { TERMS } from '../consts'

interface Props {
  selectedSeries: string
  onChange: (seriesId: string) => void
}

export default function SeriesSelector({ selectedSeries, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {TERMS.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`px-3 py-1.5 rounded text-xs font-bold font-mono transition-colors cursor-pointer ${
            selectedSeries === s.id
              ? 'bg-emerald-500 text-black'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
