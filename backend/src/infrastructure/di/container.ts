import { Container } from 'typedi';

// Import repository implementations
import { OrderRepositoryPrisma } from '../../modules/order/infrastructure/order.repository.prisma';

// Import use cases
import { CreateOrder } from '../../modules/order/application/create-order.usecase';
import { UpdateOrderStatus } from '../../modules/order/application/update-order-status.usecase';
import { GetOrderById } from '../../modules/order/application/get-order-by-id.usecase';
import { ListOrders } from '../../modules/order/application/list-orders.usecase';
import { CancelOrder } from '../../modules/order/application/cancel-order.usecase';


// Import public APIs
import { OrderPublicApi } from '../../modules/order/public/order.public-api';



export function registerDependencies() {
  // ============================================
  // ORDER MODULE
  // ============================================
  
  // Register repository
  const orderRepository = new OrderRepositoryPrisma();
  Container.set('OrderRepository', orderRepository);

  // Register use cases
  Container.set('CreateOrderUseCase', new CreateOrder(orderRepository));
  Container.set('UpdateOrderStatusUseCase', new UpdateOrderStatus(orderRepository));
  Container.set('GetOrderByIdUseCase', new GetOrderById(orderRepository));
  Container.set('ListOrdersUseCase', new ListOrders(orderRepository));
  Container.set('CancelOrderUseCase', new CancelOrder(orderRepository));

  // Register public API
  Container.set('OrderPublicApi', new OrderPublicApi(orderRepository));

  // Future modules will be registered here...
}

export { Container };