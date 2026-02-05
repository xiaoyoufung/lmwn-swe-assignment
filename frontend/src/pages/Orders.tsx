import PageTitle from "@/components/pos/PageTitle";
import { StatusBadge } from "@/components/pos/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/order";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

type FilterStatus = OrderStatus | 'ALL';

const Orders = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
    
    return (
        <div>
            <PageTitle title="Orders" />
           <div className="flex flex-wrap gap-2 p-4">
                <StatusBadge status="PENDING" />
                <StatusBadge status="CONFIRMED" />
                <StatusBadge status="PREPARING" />
                <StatusBadge status="READY" />
                <StatusBadge status="COMPLETED" />
                <StatusBadge status="CANCELLED" />
            </div>
            <Badge variant="default">Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
        </div>
        
    )
}

export default Orders;