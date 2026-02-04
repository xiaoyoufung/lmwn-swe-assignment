import { prisma } from '../../../infrastructure/database';
import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';
import { OrderItem } from '../domain/order-item.entity';
import { OrderStatus } from '../domain/order-status.enum';
import { OrderStatusHistory } from '../domain/order-status-history.entity';
import { Discount, DiscountType } from '../domain/discount.value-object';
import { OrderFilters } from '../domain/order.repository.interface';

export class OrderRepositoryPrisma implements IOrderRepository {
  // ============================================
  // Queries
  // ============================================

  async findById(id: string): Promise<Order | null> {
    const data = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const data = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findAll(filters?: OrderFilters): Promise<Order[]> {
    const data = await prisma.order.findMany({
      where: {
        status: filters?.status,
        orderNumber: filters?.orderNumber,
        createdAt: filters?.dateRange
          ? {
              gte: filters.dateRange.from,
              lte: filters.dateRange.to,
            }
          : undefined,
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((d) => this.toDomain(d));
  }

  async getStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    const data = await prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { changedAt: 'asc' },
    });

    return data.map(
      (d) =>
        new OrderStatusHistory(
          d.id,
          d.orderId,
          d.fromStatus as OrderStatus | null,
          d.toStatus as OrderStatus,
          d.reason,
          d.changedAt,
          d.changedBy
        )
    );
  }

  // ============================================
  // Commands
  // ============================================

  async create(order: Order): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Create order
      await tx.order.create({
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: order.subtotal,
          discountAmount: order.discountAmount,
          total: order.total,
          discountType: order.discount?.type,
          discountValue: order.discount?.value,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });

      // Create order items
      if (order.items.length > 0) {
        await tx.orderItem.createMany({
          data: order.items.map((item) => ({
            id: item.id,
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        });
      }

      // Create initial status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: null,
          toStatus: order.status,
          reason: 'Order created',
        },
      });
    });
  }

  async update(order: Order): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update order
      await tx.order.update({
        where: { id: order.id },
        data: {
          subtotal: order.subtotal,
          discountAmount: order.discountAmount,
          total: order.total,
          discountType: order.discount?.type,
          discountValue: order.discount?.value,
          status: order.status,
          updatedAt: new Date(),
        },
      });

      // Delete existing items
      await tx.orderItem.deleteMany({
        where: { orderId: order.id },
      });

      // Recreate items
      if (order.items.length > 0) {
        await tx.orderItem.createMany({
          data: order.items.map((item) => ({
            id: item.id,
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        });
      }
    });
  }

  async updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    reason?: string
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });

      // Update order status
      await tx.order.update({
        where: { id: orderId },
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
          reason,
        },
      });
    });
  }

  // ============================================
  // Statistics
  // ============================================

  async countByStatus(status: OrderStatus): Promise<number> {
    return await prisma.order.count({
      where: { status },
    });
  }

  async getTotalSales(from: Date, to: Date): Promise<number> {
    const result = await prisma.order.aggregate({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        total: true,
      },
    });

    return result._sum.total || 0;
  }

  // ============================================
  // Mappers
  // ============================================

  private toDomain(data: any): Order {
    const items = data.items.map(
      (item: any) =>
        new OrderItem(
          item.id,
          item.productId,
          item.productName,
          item.quantity,
          item.unitPrice
        )
    );

    const discount =
      data.discountType && data.discountValue
        ? new Discount(data.discountType as DiscountType, data.discountValue)
        : null;

    return Order.reconstitute(
      data.id,
      data.orderNumber,
      items,
      discount,
      data.status as OrderStatus,
      data.createdAt,
      data.updatedAt
    );
  }
}