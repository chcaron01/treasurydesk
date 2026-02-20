export default function Header() {
  const now = new Date().toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="max-w-6xl mx-auto w-full px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-white font-bold tracking-tight text-lg">Treasury Desk</span>
          </div>
        </div>
        <span className="text-zinc-500 text-xs">{now}</span>
      </div>
    </header>
  )
}
