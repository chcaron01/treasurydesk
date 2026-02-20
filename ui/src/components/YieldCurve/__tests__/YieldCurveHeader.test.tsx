import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import YieldCurveHeader from '../YieldCurveHeader'
import type { YieldPoint, TimeRange } from '../../../types'

const RANGE_1Y: TimeRange = {
  preset: '1Y',
  startDate: '2024-02-20',
  endDate: '2025-02-20',
}

const CUSTOM_RANGE: TimeRange = {
  preset: 'custom',
  startDate: '2022-01-01',
  endDate: '2024-06-30',
}

const YIELD: YieldPoint = { label: '10Y', months: 120, yield: 4.37 }

describe('YieldCurveHeader', () => {
  it('renders the US Treasury label', () => {
    render(
      <YieldCurveHeader
        timeRange={RANGE_1Y}
        selectedLabel="10Y"
        currentYield={YIELD}
        loading={false}
      />
    )
    expect(screen.getByText(/us treasury/i)).toBeInTheDocument()
  })

  it('renders preset label as "1Y History"', () => {
    render(
      <YieldCurveHeader
        timeRange={RANGE_1Y}
        selectedLabel="10Y"
        currentYield={undefined}
        loading={false}
      />
    )
    expect(screen.getByText('1Y History')).toBeInTheDocument()
  })

  it('renders custom range as "startDate – endDate"', () => {
    render(
      <YieldCurveHeader
        timeRange={CUSTOM_RANGE}
        selectedLabel="10Y"
        currentYield={undefined}
        loading={false}
      />
    )
    expect(screen.getByText('2022-01-01 – 2024-06-30')).toBeInTheDocument()
  })

  it('shows the current yield value when provided', () => {
    render(
      <YieldCurveHeader
        timeRange={RANGE_1Y}
        selectedLabel="10Y"
        currentYield={YIELD}
        loading={false}
      />
    )
    expect(screen.getByText('4.37%')).toBeInTheDocument()
  })

  it('shows the selected label alongside the yield', () => {
    render(
      <YieldCurveHeader
        timeRange={RANGE_1Y}
        selectedLabel="10Y"
        currentYield={YIELD}
        loading={false}
      />
    )
    expect(screen.getByText(/10y current yield/i)).toBeInTheDocument()
  })

  it('does not render yield section when currentYield is undefined', () => {
    render(
      <YieldCurveHeader
        timeRange={RANGE_1Y}
        selectedLabel="10Y"
        currentYield={undefined}
        loading={false}
      />
    )
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })

  it('shows LOADING... indicator when loading=true', () => {
    render(
      <YieldCurveHeader
        timeRange={RANGE_1Y}
        selectedLabel="10Y"
        currentYield={undefined}
        loading={true}
      />
    )
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('hides LOADING... indicator when loading=false', () => {
    render(
      <YieldCurveHeader
        timeRange={RANGE_1Y}
        selectedLabel="10Y"
        currentYield={undefined}
        loading={false}
      />
    )
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
})
