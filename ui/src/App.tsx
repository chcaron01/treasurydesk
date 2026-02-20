import { useOrders } from './api/useOrders'
import Header from './components/Header'
import YieldCurve from './components/YieldCurve'
import OrderForm from './components/OrderForm'
import OrderHistory from './components/OrderHistory'

export default function App() {
  const { data: orders = [], isPending: ordersLoading } = useOrders()

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Main content */}
      <main className="max-w-6xl mx-auto w-full px-8 py-8 flex flex-col gap-6">
        <YieldCurve />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <OrderForm />
          </div>
          <div className="lg:col-span-2">
            <OrderHistory orders={orders} loading={ordersLoading} />
          </div>
        </div>
      </main>
    </div>
  )
}
