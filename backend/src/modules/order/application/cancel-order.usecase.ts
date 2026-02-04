import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';
import { OrderStatus } from '../domain/order-status.enum';

export class CancelOrder {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string, reason: string): Promise<Order> {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Cancellation reason is required');
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Domain logic validates if cancellation is allowed
    order.cancel(reason);

    await this.orderRepository.updateStatus(
      orderId,
      OrderStatus.CANCELLED,
      reason
    );

    return order;
  }
}