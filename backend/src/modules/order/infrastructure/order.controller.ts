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
          orderId: order.orderId,  // Changed from 'id'
          restaurantId: order.restaurantId,
          tableId: order.tableId,
          subtotalMinor: order.subtotalMinor,  // Changed from 'subtotal'
          discountTotalMinor: order.discountTotalMinor,  // Changed from 'discountAmount'
          totalMinor: order.totalMinor,  // Changed from 'total'
          status: order.status,
          items: order.items.map(item => ({
            orderItemId: item.orderItemId,
            itemId: item.itemId,
            itemNameSnapshot: item.itemNameSnapshot,
            quantity: item.quantity,
            unitPriceMinorSnapshot: item.unitPriceMinorSnapshot,
            lineTotalMinor: item.lineTotalMinor,
          })),
          appliedDiscounts: order.appliedDiscounts.map(discount => ({
            orderDiscountId: discount.orderDiscountId,
            discountId: discount.discountId,
            type: discount.type,
            value: discount.value,
            appliedAmountMinor: discount.appliedAmountMinor,
          })),
          createdAt: order.createdAt,
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
          orderId: order.orderId,  // Changed from 'id'
          restaurantId: order.restaurantId,
          tableId: order.tableId,
          subtotalMinor: order.subtotalMinor,  // Changed from 'subtotal'
          discountTotalMinor: order.discountTotalMinor,  // Changed from 'discountAmount'
          totalMinor: order.totalMinor,  // Changed from 'total'
          status: order.status,
          items: order.items.map(item => ({
            orderItemId: item.orderItemId,
            itemId: item.itemId,
            itemNameSnapshot: item.itemNameSnapshot,
            quantity: item.quantity,
            unitPriceMinorSnapshot: item.unitPriceMinorSnapshot,
            lineTotalMinor: item.lineTotalMinor,
          })),
          appliedDiscounts: order.appliedDiscounts.map(discount => ({
            orderDiscountId: discount.orderDiscountId,
            discountId: discount.discountId,
            type: discount.type,
            value: discount.value,
            appliedAmountMinor: discount.appliedAmountMinor,
          })),
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
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
          orderId: order.orderId,  // Changed from 'id'
          restaurantId: order.restaurantId,
          tableId: order.tableId,
          subtotalMinor: order.subtotalMinor,
          discountTotalMinor: order.discountTotalMinor,
          totalMinor: order.totalMinor,
          status: order.status,
          createdAt: order.createdAt,
          itemCount: order.itemCount,  // Useful summary field
          items: order.items.map(item => ({  // Fixed syntax error - was missing closing braces
            orderItemId: item.orderItemId,
            itemId: item.itemId,  // Changed from 'productId'
            itemNameSnapshot: item.itemNameSnapshot,  // Changed from 'name'
            quantity: item.quantity,
            unitPriceMinorSnapshot: item.unitPriceMinorSnapshot,
            lineTotalMinor: item.lineTotalMinor,
          })),
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
        changedByUserId: req.body.changedByUserId,  // Changed from 'reason' - this is required
        notes: req.body.notes,  // Changed from 'reason' to 'notes'
      });

      res.status(200).json({
        success: true,
        data: {
          orderId: order.orderId,  // Changed from 'id'
          status: order.status,
          updatedAt: order.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = Container.get<CancelOrder>('CancelOrderUseCase');
      const order = await useCase.execute({
        orderId: req.params.id,
        changedByUserId: req.body.changedByUserId,  // Added - required for audit
        reason: req.body.reason,
      });

      res.status(200).json({
        success: true,
        data: {
          orderId: order.orderId,  // Changed from 'id'
          status: order.status,
          updatedAt: order.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}