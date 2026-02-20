import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { toDate, toStr, formatDateShort } from '../../utils/date'

interface Props {
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  onChange: (startDate: string, endDate: string) => void
}

const calendarClassNames = {
  root: 'text-zinc-300 font-mono text-xs',
  months: 'flex gap-6',
  month: 'w-[200px]',
  month_caption: 'flex justify-center items-center mb-2 px-1 gap-2',
  caption_label: 'hidden',
  nav: 'hidden',
  month_grid: 'w-full border-collapse',
  weekdays: 'text-zinc-600 uppercase text-[10px]',
  weekday: 'w-7 text-center pb-1',
  week: '',
  day: 'w-7 h-7 text-center',
  day_button: `w-7 h-7 rounded text-xs cursor-pointer transition-colors
               hover:bg-zinc-800 hover:text-white
               focus:outline-none`,
  today: 'text-emerald-400 font-bold',
  selected: 'bg-emerald-500 text-black font-bold rounded',
  outside: 'text-zinc-700',
  disabled: 'text-zinc-800 cursor-default',
  hidden: 'invisible',
  dropdown:
    'bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded px-1 py-0.5 focus:outline-none focus:border-emerald-500 cursor-pointer',
  dropdowns: 'flex items-center gap-2',
}

const dropdownClass =
  'absolute top-full mt-2 z-50 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-3'

function btnClass(active: boolean): string {
  return `px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer border ${
    active
      ? 'bg-zinc-800 border-emerald-500 text-white'
      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
  }`
}

export default function DateRangePicker({ startDate, endDate, onChange }: Props) {
  const [open, setOpen] = useState<'start' | 'end' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="flex items-center gap-1.5">
      {/* Start date picker */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => (v === 'start' ? null : 'start'))}
          className={btnClass(open === 'start')}
        >
          {formatDateShort(startDate)}
        </button>
        {open === 'start' && (
          <div className={`${dropdownClass} left-0`}>
            <DayPicker
              mode="single"
              selected={toDate(startDate)}
              onSelect={(d) => {
                if (d) {
                  onChange(toStr(d), endDate)
                  setOpen(null)
                }
              }}
              hidden={{ after: toDate(endDate) }}
              startMonth={new Date(2000, 0)}
              captionLayout="dropdown"
              numberOfMonths={1}
              classNames={calendarClassNames}
            />
          </div>
        )}
      </div>

      <span className="text-zinc-600 font-mono text-xs">→</span>

      {/* End date picker */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => (v === 'end' ? null : 'end'))}
          className={btnClass(open === 'end')}
        >
          {formatDateShort(endDate)}
        </button>
        {open === 'end' && (
          <div className={`${dropdownClass} right-0`}>
            <DayPicker
              mode="single"
              selected={toDate(endDate)}
              onSelect={(d) => {
                if (d) {
                  onChange(startDate, toStr(d))
                  setOpen(null)
                }
              }}
              hidden={{ before: toDate(startDate), after: new Date() }}
              startMonth={new Date(2000, 0)}
              captionLayout="dropdown"
              numberOfMonths={1}
              classNames={calendarClassNames}
            />
          </div>
        )}
      </div>
    </div>
  )
}
