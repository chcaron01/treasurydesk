import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'
import OrderForm from '../OrderForm'
import * as useOrdersModule from '../../api/useOrders'
import * as useYieldsModule from '../../api/useYields'
import type { YieldPoint } from '../../types'

const YIELDS: YieldPoint[] = [
  { label: '1M', months: 1, yield: 5.2 },
  { label: '10Y', months: 120, yield: 4.25 },
  { label: '30Y', months: 360, yield: 4.5 },
]

function mockHooks(mutateAsync = vi.fn().mockResolvedValue({}), isPending = false) {
  vi.spyOn(useYieldsModule, 'useYields').mockReturnValue({
    data: YIELDS,
  } as unknown as ReturnType<typeof useYieldsModule.useYields>)

  vi.spyOn(useOrdersModule, 'useSubmitOrder').mockReturnValue({
    mutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useOrdersModule.useSubmitOrder>)

  return { mutateAsync }
}

function setup(mutateAsync = vi.fn().mockResolvedValue({})) {
  const { mutateAsync: mock } = mockHooks(mutateAsync)
  const user = userEvent.setup()
  render(
    <>
      <Toaster />
      <OrderForm />
    </>
  )
  return { user, mutateAsync: mock }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('OrderForm', () => {
  describe('rendering', () => {
    it('renders the form heading', () => {
      setup()
      expect(screen.getByText('Treasury Purchase')).toBeInTheDocument()
    })

    it('renders all term buttons', () => {
      setup()
      const terms = ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y', '30Y']
      terms.forEach((t) => {
        expect(screen.getByRole('button', { name: t })).toBeInTheDocument()
      })
    })

    it('defaults selected term to 10Y', () => {
      setup()
      expect(screen.getByRole('button', { name: '10Y' }).className).toMatch(/bg-emerald-500/)
    })

    it('shows current yield for default term (10Y)', () => {
      setup()
      expect(screen.getByText('4.25%')).toBeInTheDocument()
    })

    it('shows dash when no yield data is available', () => {
      vi.spyOn(useYieldsModule, 'useYields').mockReturnValue({
        data: [],
      } as unknown as ReturnType<typeof useYieldsModule.useYields>)
      vi.spyOn(useOrdersModule, 'useSubmitOrder').mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as unknown as ReturnType<typeof useOrdersModule.useSubmitOrder>)
      render(<OrderForm />)
      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('renders the Place Order button', () => {
      setup()
      expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument()
    })

    it('renders the amount input', () => {
      setup()
      expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    })

    it('disables the button when isPending is true', () => {
      mockHooks(vi.fn(), true)
      render(<OrderForm />)
      expect(screen.getByRole('button', { name: /placing order/i })).toBeDisabled()
    })
  })

  describe('term selection', () => {
    it('switches active term when a term button is clicked', async () => {
      const { user } = setup()
      await user.click(screen.getByRole('button', { name: '1M' }))
      expect(screen.getByRole('button', { name: '1M' }).className).toMatch(/bg-emerald-500/)
    })

    it('updates the yield preview when switching terms', async () => {
      const { user } = setup()
      await user.click(screen.getByRole('button', { name: '1M' }))
      expect(screen.getByText('5.20%')).toBeInTheDocument()
    })

    it('deselects the previous term when a new one is selected', async () => {
      const { user } = setup()
      await user.click(screen.getByRole('button', { name: '1M' }))
      expect(screen.getByRole('button', { name: '10Y' }).className).not.toMatch(/bg-emerald-500/)
    })
  })

  describe('validation', () => {
    it('shows a toast error and does not call mutateAsync with empty amount', async () => {
      const { user, mutateAsync } = setup()
      await user.click(screen.getByRole('button', { name: /place order/i }))
      await waitFor(() =>
        expect(screen.getAllByText(/enter a valid amount/i).length).toBeGreaterThan(0)
      )
      expect(mutateAsync).not.toHaveBeenCalled()
    })
  })

  describe('successful submission', () => {
    it('calls mutateAsync with the selected term and parsed amount', async () => {
      const { user, mutateAsync } = setup()
      await user.type(screen.getByRole('spinbutton'), '50000')
      await user.click(screen.getByRole('button', { name: /place order/i }))
      await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith({ term: '10Y', amount: 50000 }))
    })

    it('passes the correct term when switched before submitting', async () => {
      const { user, mutateAsync } = setup()
      await user.click(screen.getByRole('button', { name: '30Y' }))
      await user.type(screen.getByRole('spinbutton'), '10000')
      await user.click(screen.getByRole('button', { name: /place order/i }))
      await waitFor(() =>
        expect(mutateAsync).toHaveBeenCalledWith({ term: '30Y', amount: 10000 })
      )
    })

    it('shows a success toast after submission', async () => {
      const { user } = setup()
      await user.type(screen.getByRole('spinbutton'), '10000')
      await user.click(screen.getByRole('button', { name: /place order/i }))
      await waitFor(() =>
        expect(screen.getAllByText(/order confirmed/i).length).toBeGreaterThan(0)
      )
    })

    it('clears the amount field after successful submission', async () => {
      const { user } = setup()
      const input = screen.getByRole('spinbutton')
      await user.type(input, '10000')
      await user.click(screen.getByRole('button', { name: /place order/i }))
      await waitFor(() => expect(input).toHaveValue(null))
    })
  })

  describe('failed submission', () => {
    it('shows a toast with the server error message', async () => {
      const { user } = setup(vi.fn().mockRejectedValue(new Error('Server error')))
      await user.type(screen.getByRole('spinbutton'), '5000')
      await user.click(screen.getByRole('button', { name: /place order/i }))
      await waitFor(() =>
        expect(screen.getAllByText(/server error/i).length).toBeGreaterThan(0)
      )
    })

    it('shows a generic toast when error is not an Error instance', async () => {
      const { user } = setup(vi.fn().mockRejectedValue('oops'))
      await user.type(screen.getByRole('spinbutton'), '5000')
      await user.click(screen.getByRole('button', { name: /place order/i }))
      await waitFor(() =>
        expect(screen.getAllByText(/submission failed/i).length).toBeGreaterThan(0)
      )
    })

    it('re-enables the submit button after a failed submission', async () => {
      const { user } = setup(vi.fn().mockRejectedValue(new Error('fail')))
      await user.type(screen.getByRole('spinbutton'), '5000')
      await user.click(screen.getByRole('button', { name: /place order/i }))
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /place order/i })).not.toBeDisabled()
      )
    })
  })
})
