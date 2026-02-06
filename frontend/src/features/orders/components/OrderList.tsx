import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { OrderStatus } from '../types/order.types'
import { Button } from '@/components/ui/button'
import LoadingState from '@/components/common/LoadingState'
import EmptyState from '@/components/common/EmptyState'
import { Card } from '@/components/ui/card'
import OrderCard from './OrderCard'
import OrderFilters from './OrderFilters'

export default function OrderList() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>()
  const { data: orders, isLoading } = useOrders(statusFilter)

  console.log('Orders data:', orders)
  console.log('Status filter:', statusFilter)

  if (isLoading) return <LoadingState />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <Link to="/orders/new">
          <Button>+ Create Order</Button>
        </Link>
      </div>

      <OrderFilters selectedStatus={statusFilter} onStatusChange={setStatusFilter} />

      {!orders || orders.length === 0 ? (
        <Card>
          <EmptyState
            title="No orders found"
            description="Create your first order to get started"
            action={
              <Link to="/orders/new">
                <Button>Create Order</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}