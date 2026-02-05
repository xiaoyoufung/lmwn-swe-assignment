 import { cn } from '@/lib/utils';
 import type { OrderStatus } from '@/types/order';
 import { STATUS_LABELS } from '@/types/order';
 
 type FilterStatus = OrderStatus | 'ALL';
 
 interface StatusFilterProps {
   value: FilterStatus;
   onChange: (status: FilterStatus) => void;
   counts?: Record<FilterStatus, number>;
 }
 
 const FILTER_OPTIONS: FilterStatus[] = [
   'ALL',
   'PENDING',
   'CONFIRMED',
   'PREPARING',
   'READY',
   'COMPLETED',
   'CANCELLED',
 ];
 
 export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
   return (
     <div className="flex flex-wrap gap-2">
       {FILTER_OPTIONS.map((status) => (
         <button
           key={status}
           onClick={() => onChange(status)}
           className={cn(
             'px-4 py-2 rounded-lg text-sm font-medium transition-all btn-pos',
             value === status
               ? 'bg-primary text-primary-foreground shadow-md'
               : 'bg-card text-muted-foreground hover:bg-muted border border-border'
           )}
         >
           {status === 'ALL' ? 'All Orders' : STATUS_LABELS[status]}
           {counts && counts[status] !== undefined && (
             <span className={cn(
               'ml-2 px-2 py-0.5 rounded-full text-xs',
               value === status
                 ? 'bg-primary-foreground/20'
                 : 'bg-muted-foreground/10'
             )}>
               {counts[status]}
             </span>
           )}
         </button>
       ))}
     </div>
   );
 }