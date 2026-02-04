import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';

export class GetOrderById {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return order;
  }
}