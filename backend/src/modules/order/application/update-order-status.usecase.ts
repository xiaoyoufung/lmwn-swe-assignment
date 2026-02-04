import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

export class UpdateOrderStatus {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(dto: UpdateOrderStatusDto): Promise<Order> {
    // Find order
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new Error(`Order ${dto.orderId} not found`);
    }

    // Change status (domain logic validates transition)
    order.changeStatus(dto.newStatus, dto.reason);

    // Persist with status history
    await this.orderRepository.updateStatus(
      dto.orderId,
      dto.newStatus,
      dto.reason
    );

    return order;
  }
}