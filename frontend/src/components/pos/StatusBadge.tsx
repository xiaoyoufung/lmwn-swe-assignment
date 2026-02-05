 import { cn } from '@/lib/utils';
 import type { OrderStatus } from '@/types/order';
import { STATUS_LABELS } from '@/types/order';
 
 interface StatusBadgeProps {
   status: OrderStatus;
   className?: string;
 }
 
 export function StatusBadge({ status, className }: StatusBadgeProps) {
   const statusClasses: Record<OrderStatus, string> = {
     PENDING: 'status-pending',
     CONFIRMED: 'status-confirmed',
     PREPARING: 'status-preparing',
     READY: 'status-ready',
     COMPLETED: 'status-completed',
     CANCELLED: 'status-cancelled',
   };
 
   return (
     <span className={cn('status-badge', statusClasses[status], className)}>
       {STATUS_LABELS[status]}
     </span>
   );
 }