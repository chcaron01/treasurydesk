import type { Order, YieldPoint, HistoryPoint, TimeRange } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export async function fetchYields(): Promise<YieldPoint[]> {
  const res = await fetch(`${API_URL}/yields`)
  if (!res.ok) {
    throw new Error(`Failed to fetch yields: ${res.status}`)
  }
  return res.json()
}

export async function fetchYieldHistory(
  seriesId: string,
  range: TimeRange
): Promise<HistoryPoint[]> {
  const params = new URLSearchParams({
    series: seriesId,
    start: range.startDate,
    end: range.endDate,
  })
  const res = await fetch(`${API_URL}/yields/history?${params}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch history: ${res.status}`)
  }
  return res.json()
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`)
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.status}`)
  }
  return res.json()
}

export async function submitOrder(term: string, amount: number): Promise<Order> {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ term, amount }),
  })
  if (!res.ok) {
    throw new Error(`Failed to submit order: ${res.status}`)
  }
  return res.json()
}
