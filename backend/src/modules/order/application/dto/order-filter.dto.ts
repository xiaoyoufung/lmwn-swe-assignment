import { OrderStatus } from "../../domain/order-status.enum";

export interface OrderFiltersDto {
  status?: OrderStatus;
  dateRange?: {
    from: Date;
    to: Date;
  };
  orderNumber?: string;
}