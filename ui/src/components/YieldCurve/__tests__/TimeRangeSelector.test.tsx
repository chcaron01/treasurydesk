import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TimeRangeSelector from '../TimeRangeSelector'
import type { TimeRange } from '../../../types'

const DEFAULT_RANGE: TimeRange = {
  preset: '1Y',
  startDate: '2024-02-20',
  endDate: '2025-02-20',
}

describe('TimeRangeSelector', () => {
  it('renders preset buttons for 1Y, 5Y, 10Y', () => {
    render(
      <TimeRangeSelector
        timeRange={DEFAULT_RANGE}
        onPresetChange={vi.fn()}
        onCustomChange={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: '1Y' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5Y' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '10Y' })).toBeInTheDocument()
  })

  it('highlights the active preset', () => {
    render(
      <TimeRangeSelector
        timeRange={DEFAULT_RANGE}
        onPresetChange={vi.fn()}
        onCustomChange={vi.fn()}
      />
    )
    const activeBtn = screen.getByRole('button', { name: '1Y' })
    expect(activeBtn.className).toMatch(/bg-emerald-500/)
  })

  it('does not highlight inactive presets', () => {
    render(
      <TimeRangeSelector
        timeRange={DEFAULT_RANGE}
        onPresetChange={vi.fn()}
        onCustomChange={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: '5Y' }).className).not.toMatch(/bg-emerald-500/)
    expect(screen.getByRole('button', { name: '10Y' }).className).not.toMatch(/bg-emerald-500/)
  })

  it('calls onPresetChange with the correct preset when clicked', async () => {
    const onPresetChange = vi.fn()
    const user = userEvent.setup()
    render(
      <TimeRangeSelector
        timeRange={DEFAULT_RANGE}
        onPresetChange={onPresetChange}
        onCustomChange={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: '5Y' }))
    expect(onPresetChange).toHaveBeenCalledWith('5Y')
  })

  it('renders the date range picker with current dates', () => {
    render(
      <TimeRangeSelector
        timeRange={DEFAULT_RANGE}
        onPresetChange={vi.fn()}
        onCustomChange={vi.fn()}
      />
    )
    // DateRangePicker renders formatted date buttons; check for the year
    expect(screen.getByText(/2025/)).toBeInTheDocument()
  })

  it('highlights no preset when using a custom range', () => {
    const customRange: TimeRange = {
      preset: 'custom',
      startDate: '2023-01-01',
      endDate: '2024-01-01',
    }
    render(
      <TimeRangeSelector
        timeRange={customRange}
        onPresetChange={vi.fn()}
        onCustomChange={vi.fn()}
      />
    )
    ;['1Y', '5Y', '10Y'].forEach((label) => {
      expect(screen.getByRole('button', { name: label }).className).not.toMatch(/bg-emerald-500/)
    })
  })
})
