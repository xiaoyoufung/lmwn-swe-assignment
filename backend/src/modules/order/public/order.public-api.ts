import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';

/**
 * Public API for other modules to interact with Order module
 */
export interface IOrderPublicApi {
  getOrderById(id: string): Promise<Order | null>;
  validateOrderExists(id: string): Promise<boolean>;
  getOrderTotal(id: string): Promise<number>;
}

export class OrderPublicApi implements IOrderPublicApi {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async getOrderById(id: string): Promise<Order | null> {
    return await this.orderRepository.findById(id);
  }

  async validateOrderExists(id: string): Promise<boolean> {
    const order = await this.orderRepository.findById(id);
    return order !== null;
  }

  async getOrderTotal(id: string): Promise<number> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order ${id} not found`);
    }
    return order.total;
  }
}