import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';
import { OrderFiltersDto } from './dto/order-filter.dto';

export class ListOrders {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(filters?: OrderFiltersDto): Promise<Order[]> {
    return await this.orderRepository.findAll(filters);
  }
}