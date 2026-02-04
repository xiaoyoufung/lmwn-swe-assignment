import { randomUUID } from 'crypto';
import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';
import { OrderItem } from '../domain/order-item.entity';
import { Discount } from '../domain/discount.value-object';
import { CreateOrderDto } from './dto/create-order.dto';

export class CreateOrder {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    // Validate
    if (!dto.items || dto.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order items
    const items = dto.items.map((itemDto) =>
      OrderItem.create(
        randomUUID(),
        itemDto.productId,
        itemDto.productName,
        itemDto.quantity,
        itemDto.unitPrice
      )
    );

    // Create discount if provided
    const discount = dto.discount
      ? new Discount(dto.discount.type, dto.discount.value)
      : null;

    // Create order entity
    const order = Order.create(randomUUID(), orderNumber, items, discount);

    // Persist
    await this.orderRepository.create(order);

    return order;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}