import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { CreateOrder } from '../application/create-order.usecase';
import { UpdateOrderStatus } from '../application/update-order-status.usecase';
import { GetOrderById } from '../application/get-order-by-id.usecase';
import { ListOrders } from '../application/list-orders.usecase';
import { CancelOrder } from '../application/cancel-order.usecase';

export class OrderController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = Container.get<CreateOrder>('CreateOrderUseCase');
      const order = await useCase.execute(req.body);
      
      res.status(201).json({
        success: true,
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: order.subtotal,
          discountAmount: order.discountAmount,
          total: order.total,
          status: order.status,
          items: order.items,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = Container.get<GetOrderById>('GetOrderByIdUseCase');
      const order = await useCase.execute(req.params.id);

      res.status(200).json({
        success: true,
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: order.subtotal,
          discountAmount: order.discountAmount,
          total: order.total,
          status: order.status,
          items: order.items,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = Container.get<ListOrders>('ListOrdersUseCase');
      const orders = await useCase.execute(req.query);

      res.status(200).json({
        success: true,
        data: orders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = Container.get<UpdateOrderStatus>('UpdateOrderStatusUseCase');
      const order = await useCase.execute({
        orderId: req.params.id,
        newStatus: req.body.status,
        reason: req.body.reason,
      });

      res.status(200).json({
        success: true,
        data: {
          id: order.id,
          status: order.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = Container.get<CancelOrder>('CancelOrderUseCase');
      const order = await useCase.execute(req.params.id, req.body.reason);

      res.status(200).json({
        success: true,
        data: {
          id: order.id,
          status: order.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}