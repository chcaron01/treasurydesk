import { useState } from 'react'
import toast from 'react-hot-toast'
import { useYields } from '../api/useYields'
import { useSubmitOrder } from '../api/useOrders'
import { TERMS } from './consts.ts'

export default function OrderForm() {
  const [term, setTerm] = useState('10Y')
  const [amount, setAmount] = useState('')

  const { data: yields = [] } = useYields()
  const { mutateAsync, isPending } = useSubmitOrder()

  const selectedYield = yields.find((y) => y.label === term)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    try {
      await mutateAsync({ term, amount: amt })
      toast.success('Order confirmed')
      setAmount('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed')
    }
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-0.5">
          New Order
        </p>
        <p className="text-white font-bold text-lg">Treasury Purchase</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Term */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 block">
            Maturity
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {TERMS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setTerm(t.label)}
                className={`py-1.5 rounded text-xs font-bold font-mono transition-colors cursor-pointer ${
                  term === t.label
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Yield preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-3 flex items-center justify-between">
          <span className="text-zinc-500 text-xs uppercase tracking-wider">Yield ({term})</span>
          <span className="text-emerald-400 font-bold font-mono text-xl">
            {selectedYield ? `${selectedYield.yield.toFixed(2)}%` : '—'}
          </span>
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 block">
            Principal (USD)
          </label>
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">
              USD
            </span>
            <input
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500/60 focus:outline-none rounded pl-4 pr-14 py-2.5 text-white font-mono placeholder-zinc-600 transition-colors text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold py-3 rounded text-sm tracking-wide transition-colors cursor-pointer"
        >
          {isPending ? 'PLACING ORDER...' : 'PLACE ORDER'}
        </button>
      </form>
    </div>
  )
}
