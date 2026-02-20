import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchOrders, submitOrder } from '../api'
import type { Order } from '../types'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  })
}

export function useSubmitOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ term, amount }: { term: string; amount: number }) => submitOrder(term, amount),
    onSuccess: (newOrder: Order) => {
      queryClient.setQueryData<Order[]>(['orders'], (prev) => [newOrder, ...(prev ?? [])])
    },
  })
}
