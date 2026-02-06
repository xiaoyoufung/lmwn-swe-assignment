import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '../types/order.types'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'link' | 'ghost'

const statusConfig: Record<OrderStatus, { variant: BadgeVariant; label: string }> = {
  [OrderStatus.PENDING]: { variant: 'secondary', label: 'Pending' },
  [OrderStatus.CONFIRMED]: { variant: 'default', label: 'Confirmed' },
  [OrderStatus.PREPARING]: { variant: 'default', label: 'Preparing' },
  [OrderStatus.READY]: { variant: 'default', label: 'Ready' },
  [OrderStatus.COMPLETED]: { variant: 'default', label: 'Completed' },
  [OrderStatus.CANCELLED]: { variant: 'destructive', label: 'Cancelled' },
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? { variant: 'outline' as const, label: 'Unknown' }
  
  return <Badge variant={config.variant}>{config.label}</Badge>
}