import { OrderStatus } from "./order-status.enum";

export class OrderStatusHistory {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly fromStatus: string | null, 
    public readonly toStatus: string,
    public readonly notes: string | null,  
    public readonly changedAt: Date,
    public readonly changedByUserId: string, 
  ) {
    this.validate();
  }

  // ============================================
  // Validation
  // ============================================

  private validate(): void {
    if (!this.orderId || this.orderId.trim().length === 0) {
      throw new Error('Order ID is required');
    }

    if (!this.toStatus || this.toStatus.trim().length === 0) {
      throw new Error('To status is required');
    }

    if (!this.changedByUserId || this.changedByUserId.trim().length === 0) {
      throw new Error('Changed by user ID is required');
    }

    // Optional: Validate that cancellations have notes
    if (this.toStatus === OrderStatus.CANCELLED && !this.notes) {
      throw new Error('Notes are required for cancellation');
    }
  }

  // ============================================
  // Factory Methods
  // ============================================

  static create(
    id: string,
    orderId: string,
    fromStatus: string | null,
    toStatus: string,
    changedByUserId: string,
    notes: string | null = null,
  ): OrderStatusHistory {
    return new OrderStatusHistory(
      id,
      orderId,
      fromStatus,
      toStatus,
      notes,
      new Date(),
      changedByUserId,
    );
  }

  static reconstitute(
    id: string,
    orderId: string,
    fromStatus: string | null,
    toStatus: string,
    notes: string | null,
    changedAt: Date,
    changedByUserId: string,
  ): OrderStatusHistory {
    return new OrderStatusHistory(
      id,
      orderId,
      fromStatus,
      toStatus,
      notes,
      changedAt,
      changedByUserId,
    );
  }

  // ============================================
  // Equality
  // ============================================

  equals(other: OrderStatusHistory): boolean {
    return this.id === other.id;
  }
}