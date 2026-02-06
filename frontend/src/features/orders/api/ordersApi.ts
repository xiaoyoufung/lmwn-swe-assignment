import { apiClient } from '@/lib/client';
import type { Order, CreateOrderInput, UpdateOrderStatusInput } from '../types/order.types';

export const ordersApi = {
  getOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const { data } = await apiClient.get<{ data: Order[] }>('/orders', { params })
    console.log('Fetched orders:', data)
    return data.data
  },

  getOrderById: async (id: string) => {
    const { data } = await apiClient.get<Order>(`/orders/${id}`)
    console.log('Fetched order by ID:', data)
    return data
  },

  createOrder: async (input: CreateOrderInput) => {
    const { data } = await apiClient.post<Order>('/orders', input)
    return data
  },

  updateOrderStatus: async (id: string, input: UpdateOrderStatusInput) => {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, input)
    return data
  },

  cancelOrder: async (id: string, reason: string, changedBy: string) => {
    const { data } = await apiClient.delete<Order>(`/orders/${id}`, {
      data: { reason, changedBy },
    })
    return data
  },
}