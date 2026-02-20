export function toDate(s: string): Date {
  return new Date(s + 'T00:00:00')
}

export function toStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function formatDateShort(s: string): string {
  return toDate(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
