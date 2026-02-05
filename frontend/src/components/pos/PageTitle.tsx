import { CirclePlus } from "lucide-react";
import { Button } from "../ui/button";

const PageTitle = ({ title }: { title: string }) => {
    return (
        <header>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
            <Button className="mt-4">
                <CirclePlus className="mr-2 size-4" />
                New Order
            </Button>
          </div>
        </header>
    )
}

export default PageTitle;