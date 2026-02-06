import { Button } from "@/components/ui/button";
import OrderList from "@/features/orders/components/OrderList";
import { CirclePlus } from "lucide-react";

const Dashboard = () => {
    return (
        <main>
          {/* <header>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <Button className="mt-4">
                <CirclePlus className="mr-2 size-4" />
                New Order
            </Button>
          </div>
        </header> */}
        <OrderList />
        </main>
        
    )
}

export default Dashboard;