import { prisma } from '../../../infrastructure/database';
import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';
import { OrderItem } from '../domain/order-item.entity';
import { OrderStatus } from '../domain/order-status.enum';
import { OrderStatusHistory } from '../domain/order-status-history.entity';
import { AppliedDiscount, DiscountType } from '../domain/applied-discount.value-object';
import { OrderFilters } from '../domain/order.repository.interface';

export class OrderRepositoryPrisma implements IOrderRepository {
  // ============================================
  // Queries
  // ============================================

  async findById(orderId: string): Promise<Order | null> {
    const data = await prisma.orders.findUnique({
      where: { orderId },
      include: { 
        orderItems: true,
        orderDiscounts: true,
      },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findAll(filters?: OrderFilters): Promise<Order[]> {
    const data = await prisma.orders.findMany({
      where: {
        restaurantId: filters?.restaurantId,
        status: filters?.status,
        orderId: filters?.orderNumber,
        createdAt: filters?.dateRange
          ? {
              gte: filters.dateRange.from,
              lte: filters.dateRange.to,
            }
          : undefined,
      },
      include: { 
        orderItems: true,
        orderDiscounts: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((d) => this.toDomain(d));
  }

  async getStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    const data = await prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { changedAt: 'asc' },
    });

    return data.map((d) =>
      OrderStatusHistory.reconstitute(
        d.id,
        d.orderId,
        d.fromStatus,
        d.toStatus,
        d.notes,
        d.changedAt,
        d.changedByUserId
      )
    );
  }

  // ============================================
  // Commands
  // ============================================

  async create(order: Order): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Create order
      await tx.orders.create({
        data: {
          orderId: order.orderId,
          restaurantId: order.restaurantId,
          tableId: order.tableId,
          createdByUserId: order.createdByUserId,
          status: order.status,
          subtotalMinor: order.subtotalMinor,
          discountTotalMinor: order.discountTotalMinor,
          totalMinor: order.totalMinor,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });

      // Create order items
      if (order.items.length > 0) {
        await tx.orderItems.createMany({
          data: order.items.map((item) => ({
            orderItemId: item.orderItemId,
            orderId: order.orderId,
            itemId: item.itemId,
            itemNameSnapshot: item.itemNameSnapshot,
            quantity: item.quantity,
            unitPriceMinorSnapshot: item.unitPriceMinorSnapshot,
            lineSubtotalMinor: item.lineSubtotalMinor,
            lineDiscountMinor: item.lineDiscountMinor,
            lineTotalMinor: item.lineTotalMinor,
          })),
        });
      }

      // Create order discounts
      if (order.appliedDiscounts.length > 0) {
        await tx.orderDiscounts.createMany({
          data: order.appliedDiscounts.map((discount) => ({
            orderDiscountId: discount.orderDiscountId,
            orderId: order.orderId,
            discountId: discount.discountId,
            type: discount.type,
            value: discount.value,
            appliedAmountMinor: discount.appliedAmountMinor,
            createdAt: discount.createdAt,
          })),
        });
      }

      // Create initial status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.orderId,
          fromStatus: order.status,
          toStatus: order.status,
          notes: 'Order created',
          changedByUserId: order.createdByUserId,
          changedAt: order.createdAt,
        },
      });
    });
  }

  async update(order: Order): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update order
      await tx.orders.update({
        where: { orderId: order.orderId },
        data: {
          status: order.status,
          subtotalMinor: order.subtotalMinor,
          discountTotalMinor: order.discountTotalMinor,
          totalMinor: order.totalMinor,
          updatedAt: order.updatedAt,
        },
      });

      // Delete existing items and recreate
      await tx.orderItems.deleteMany({
        where: { orderId: order.orderId },
      });

      if (order.items.length > 0) {
        await tx.orderItems.createMany({
          data: order.items.map((item) => ({
            orderItemId: item.orderItemId,
            orderId: order.orderId,
            itemId: item.itemId,
            itemNameSnapshot: item.itemNameSnapshot,
            quantity: item.quantity,
            unitPriceMinorSnapshot: item.unitPriceMinorSnapshot,
            lineSubtotalMinor: item.lineSubtotalMinor,
            lineDiscountMinor: item.lineDiscountMinor,
            lineTotalMinor: item.lineTotalMinor,
          })),
        });
      }

      // Delete existing discounts and recreate
      await tx.orderDiscounts.deleteMany({
        where: { orderId: order.orderId },
      });

      if (order.appliedDiscounts.length > 0) {
        await tx.orderDiscounts.createMany({
          data: order.appliedDiscounts.map((discount) => ({
            orderDiscountId: discount.orderDiscountId,
            orderId: order.orderId,
            discountId: discount.discountId,
            type: discount.type,
            value: discount.value,
            appliedAmountMinor: discount.appliedAmountMinor,
            createdAt: discount.createdAt,
          })),
        });
      }
    });
  }

  async updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    changedByUserId: string,
    notes?: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const order = await tx.orders.findUniqueOrThrow({ 
        where: { orderId } 
      });

      // Update order status
      await tx.orders.update({
        where: { orderId },
        data: {
          status: newStatus,
          updatedAt: new Date(),
        },
      });

      // Log status change
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus: order.status,
          toStatus: newStatus,
          notes,
          changedByUserId,
          changedAt: new Date(),
        },
      });
    });
  }

  // ============================================
  // Statistics
  // ============================================

  async countByStatus(status: OrderStatus): Promise<number> {
    return await prisma.orders.count({
      where: { status },
    });
  }

  async getTotalSales(restaurantId: string, from: Date, to: Date): Promise<number> {
    const result = await prisma.orders.aggregate({
      where: {
        restaurantId,
        status: OrderStatus.CONFIRMED,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        totalMinor: true,
      },
    });

    return result._sum.totalMinor || 0;
  }

  // ============================================
  // Mappers
  // ============================================

  private toDomain(data: any): Order {
    // Map order items
    const items = (data.orderItems || []).map((item: any) =>
      OrderItem.create(
        item.orderItemId,
        item.orderId,
        item.itemId,
        item.itemNameSnapshot,
        item.quantity,
        item.unitPriceMinorSnapshot
      )
    );

    // Map applied discounts
    const appliedDiscounts = (data.orderDiscounts || []).map((discount: any) =>
      AppliedDiscount.reconstitute(
        discount.orderDiscountId,
        discount.orderId,
        discount.discountId,
        discount.type as DiscountType,
        discount.value,
        discount.appliedAmountMinor,
        discount.createdAt
      )
    );

    return Order.reconstitute(
      data.orderId,
      data.restaurantId,
      data.tableId,
      data.createdByUserId,
      items,
      appliedDiscounts,
      data.status as OrderStatus,
      data.createdAt,
      data.updatedAt
    );
  }
}