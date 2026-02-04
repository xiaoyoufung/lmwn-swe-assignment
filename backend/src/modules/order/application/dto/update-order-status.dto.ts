import { OrderStatus } from "../../domain/order-status.enum";

export interface UpdateOrderStatusDto {
  orderId: string;
  newStatus: OrderStatus;
  reason?: string;
}