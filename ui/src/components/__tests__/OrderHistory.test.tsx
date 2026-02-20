import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OrderHistory from '../OrderHistory'
import type { Order } from '../../types'

const ORDERS: Order[] = [
  {
    id: 'a1b2',
    term: '10Y',
    months: 120,
    amount: 50000,
    yield: 4.25,
    createdAt: '2024-02-14T18:30:00.000Z',
  },
  {
    id: 'c3d4',
    term: '2Y',
    months: 24,
    amount: 25000,
    yield: 4.75,
    createdAt: '2024-01-10T09:00:00.000Z',
  },
]

describe('OrderHistory', () => {
  describe('loading state', () => {
    it('shows LOADING... while loading', () => {
      render(<OrderHistory orders={[]} loading={true} />)
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('does not show LOADING... when not loading', () => {
      render(<OrderHistory orders={ORDERS} loading={false} />)
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows NO ORDERS message when there are no orders and not loading', () => {
      render(<OrderHistory orders={[]} loading={false} />)
      expect(screen.getByText(/no orders/i)).toBeInTheDocument()
    })

    it('shows a hint to place an order', () => {
      render(<OrderHistory orders={[]} loading={false} />)
      expect(screen.getByText(/place an order/i)).toBeInTheDocument()
    })

    it('does not show the table when empty', () => {
      render(<OrderHistory orders={[]} loading={false} />)
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })

  describe('with orders', () => {
    it('renders the orders table', () => {
      render(<OrderHistory orders={ORDERS} loading={false} />)
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('renders the correct column headers', () => {
      render(<OrderHistory orders={ORDERS} loading={false} />)
      expect(screen.getByText(/term/i)).toBeInTheDocument()
      expect(screen.getByText(/principal/i)).toBeInTheDocument()
      expect(screen.getByText(/yield/i)).toBeInTheDocument()
      expect(screen.getByText(/time/i)).toBeInTheDocument()
    })

    it('renders a row for each order', () => {
      render(<OrderHistory orders={ORDERS} loading={false} />)
      const rows = screen.getAllByRole('row')
      // 1 header row + 2 data rows
      expect(rows).toHaveLength(3)
    })

    it('renders the term label', () => {
      render(<OrderHistory orders={ORDERS} loading={false} />)
      expect(screen.getByText('10Y')).toBeInTheDocument()
      expect(screen.getByText('2Y')).toBeInTheDocument()
    })

    it('renders the formatted currency amount', () => {
      render(<OrderHistory orders={ORDERS} loading={false} />)
      expect(screen.getByText('$50,000')).toBeInTheDocument()
      expect(screen.getByText('$25,000')).toBeInTheDocument()
    })

    it('renders the yield with 2 decimal places and % sign', () => {
      render(<OrderHistory orders={ORDERS} loading={false} />)
      expect(screen.getByText('4.25%')).toBeInTheDocument()
      expect(screen.getByText('4.75%')).toBeInTheDocument()
    })

    it('shows order count badge when orders exist', () => {
      render(<OrderHistory orders={ORDERS} loading={false} />)
      expect(screen.getByText('2 orders')).toBeInTheDocument()
    })

    it('uses singular "order" for one item', () => {
      render(<OrderHistory orders={[ORDERS[0]]} loading={false} />)
      expect(screen.getByText('1 order')).toBeInTheDocument()
    })

    it('does not show order count badge when list is empty', () => {
      render(<OrderHistory orders={[]} loading={false} />)
      // The badge is only rendered when orders.length > 0
      expect(screen.queryByText(/^\d+ order/)).not.toBeInTheDocument()
    })
  })
})
