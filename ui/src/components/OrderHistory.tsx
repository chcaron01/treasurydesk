import type { Order } from '../types'
import { formatCurrency } from '../utils/format'
import { formatDateTime } from '../utils/date'

interface Props {
  orders: Order[]
  loading: boolean
}

export default function OrderHistory({ orders, loading }: Props) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-0.5">
            History
          </p>
          <p className="text-white font-bold text-lg">Order Book</p>
        </div>
        {orders.length > 0 && (
          <span className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 rounded px-2 py-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading && <p className="text-zinc-600 text-xs font-mono animate-pulse">LOADING...</p>}

      {!loading && orders.length === 0 && (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded">
          <p className="text-zinc-600 font-mono text-sm">NO ORDERS</p>
          <p className="text-zinc-700 text-xs mt-1">Place an order to see it here</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-zinc-800">
                <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Term
                </th>
                <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Principal
                </th>
                <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Yield
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  className={`border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors ${i === 0 ? 'text-white' : 'text-zinc-300'}`}
                >
                  <td className="py-3 pr-6">
                    <span className="font-mono font-bold text-xs bg-zinc-800 text-zinc-200 px-2 py-1 rounded">
                      {order.term}
                    </span>
                  </td>
                  <td className="py-3 pr-6 font-mono font-semibold">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="py-3 pr-6">
                    <span className="text-emerald-400 font-mono font-bold">
                      {order.yield.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 text-zinc-500 font-mono text-xs">
                    {formatDateTime(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
