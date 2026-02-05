import { OrderStatusHistory } from "./order-status-history.entity";
import { OrderStatus } from "./order-status.enum";
import { Order } from "./order.entity";

export interface OrderFilters {
  restaurantId?: string;  // Added to support multi-restaurant filtering
  status?: OrderStatus;
  dateRange?: {
    from: Date;
    to: Date;
  };
  orderNumber?: string;
}

export interface IOrderRepository {
  // Queries
  findById(id: string): Promise<Order | null>;
  findAll(filters?: OrderFilters): Promise<Order[]>;
  getStatusHistory(orderId: string): Promise<OrderStatusHistory[]>;

  // Commands
  create(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    changedByUserId: string,
    notes?: string,       
  ): Promise<void>;

  // Statistics
  countByStatus(status: OrderStatus): Promise<number>;
  getTotalSales(restaurantId: string, from: Date, to: Date): Promise<number>;
}