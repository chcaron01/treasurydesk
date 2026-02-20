import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SeriesSelector from '../SeriesSelector'

const ALL_LABELS = ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y', '30Y']

describe('SeriesSelector', () => {
  it('renders a button for every term', () => {
    render(<SeriesSelector selectedSeries="DGS10" onChange={vi.fn()} />)
    ALL_LABELS.forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    })
  })

  it('highlights the currently selected series', () => {
    render(<SeriesSelector selectedSeries="DGS10" onChange={vi.fn()} />)
    const btn = screen.getByRole('button', { name: '10Y' })
    expect(btn.className).toMatch(/bg-emerald-500/)
  })

  it('does not highlight unselected series', () => {
    render(<SeriesSelector selectedSeries="DGS10" onChange={vi.fn()} />)
    const btn = screen.getByRole('button', { name: '1M' })
    expect(btn.className).not.toMatch(/bg-emerald-500/)
  })

  it('calls onChange with the correct series id when a button is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SeriesSelector selectedSeries="DGS10" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '2Y' }))
    expect(onChange).toHaveBeenCalledWith('DGS2')
  })

  it('calls onChange once per click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SeriesSelector selectedSeries="DGS10" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '5Y' }))
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
