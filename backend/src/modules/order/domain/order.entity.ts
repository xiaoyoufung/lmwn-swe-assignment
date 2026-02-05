import { OrderItem } from './order-item.entity';
import { OrderStatus, OrderStatusTransition } from './order-status.enum';
import { AppliedDiscount } from './applied-discount.value-object.ts';

export class Order {
  constructor(
    public readonly orderId: string,  // Changed from 'id' to match schema
    public readonly restaurantId: string,
    public readonly tableId: string | null,
    public readonly createdByUserId: string,
    private _items: OrderItem[],
    private _appliedDiscounts: AppliedDiscount[],  // Changed from single discount to array
    private _status: OrderStatus,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {
    this.validate();
  }

  // ============================================
  // Getters
  // ============================================

  get items(): ReadonlyArray<OrderItem> {
    return [...this._items];
  }

  get appliedDiscounts(): ReadonlyArray<AppliedDiscount> {
    return [...this._appliedDiscounts];
  }

  get status(): OrderStatus {
    return this._status;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // All monetary values in minor units (cents/satang)
  get subtotalMinor(): number {
    return this._items.reduce((sum, item) => sum + item.lineTotalMinor, 0);
  }

  get discountTotalMinor(): number {
    return this._appliedDiscounts.reduce(
      (sum, discount) => sum + discount.appliedAmountMinor,
      0
    );
  }

  get totalMinor(): number {
    return Math.max(0, this.subtotalMinor - this.discountTotalMinor);
  }

  get itemCount(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // ============================================
  // Business Logic Methods
  // ============================================

  addItem(item: OrderItem): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot add items to non-pending order');
    }

    const existingItem = this._items.find(
      (i) => i.itemId === item.itemId,
    );

    if (existingItem) {
      // Increase quantity of existing item
      const updatedItem = existingItem.increaseQuantity(item.quantity);
      this._items = this._items.map((i) =>
        i.itemId === item.itemId ? updatedItem : i,
      );
    } else {
      this._items.push(item);
    }
    
    this._updatedAt = new Date();
  }

  removeItem(orderItemId: string): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot remove items from non-pending order');
    }

    const index = this._items.findIndex((i) => i.orderItemId === orderItemId);
    if (index === -1) {
      throw new Error(`Item ${orderItemId} not found in order`);
    }

    this._items.splice(index, 1);

    if (this._items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    
    this._updatedAt = new Date();
  }

  updateItemQuantity(orderItemId: string, quantity: number): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot update items in non-pending order');
    }

    const item = this._items.find((i) => i.orderItemId === orderItemId);
    if (!item) {
      throw new Error(`Item ${orderItemId} not found in order`);
    }

    const updatedItem = item.updateQuantity(quantity);
    this._items = this._items.map((i) => 
      (i.orderItemId === orderItemId ? updatedItem : i)
    );
    
    this._updatedAt = new Date();
  }

  applyDiscount(discount: AppliedDiscount): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot apply discount to non-pending order');
    }

    this._appliedDiscounts.push(discount);
    this._updatedAt = new Date();
  }

  removeDiscount(discountId: string): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot remove discount from non-pending order');
    }

    const index = this._appliedDiscounts.findIndex(
      (d) => d.discountId === discountId
    );
    
    if (index === -1) {
      throw new Error(`Discount ${discountId} not found in order`);
    }

    this._appliedDiscounts.splice(index, 1);
    this._updatedAt = new Date();
  }

  clearDiscounts(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot clear discounts from non-pending order');
    }

    this._appliedDiscounts = [];
    this._updatedAt = new Date();
  }

  // ============================================
  // Status Management
  // ============================================

  changeStatus(newStatus: OrderStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this._status} to ${newStatus}`,
      );
    }

    this._status = newStatus;
    this._updatedAt = new Date();
  }

  canTransitionTo(newStatus: OrderStatus): boolean {
    const allowedTransitions = OrderStatusTransition[this._status] || [];
    return allowedTransitions.includes(newStatus);
  }

  confirm(): void {
    this.changeStatus(OrderStatus.CONFIRMED);
  }

  pending(): void {
    this.changeStatus(OrderStatus.PENDING);
  }

  complete(): void {
    this.changeStatus(OrderStatus.COMPLETED);
  }

  cancel(reason: string): void {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Cancellation reason is required');
    }
    
    this.changeStatus(OrderStatus.CANCELLED);
  }

  // ============================================
  // Validation
  // ============================================

  private validate(): void {
    if (!this.orderId || this.orderId.trim().length === 0) {
      throw new Error('Order ID is required');
    }

    if (!this.restaurantId || this.restaurantId.trim().length === 0) {
      throw new Error('Restaurant ID is required');
    }

    if (!this.createdByUserId || this.createdByUserId.trim().length === 0) {
      throw new Error('Created by user ID is required');
    }

    if (!this._items || this._items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    if (this.subtotalMinor < 0) {
      throw new Error('Subtotal cannot be negative');
    }

    if (this.totalMinor < 0) {
      throw new Error('Total cannot be negative');
    }
  }

  // ============================================
  // Factory Methods
  // ============================================

  static create(
    orderId: string,
    restaurantId: string,
    tableId: string | null,
    createdByUserId: string,
    items: OrderItem[],
    appliedDiscounts: AppliedDiscount[] = [],
  ): Order {
    return new Order(
      orderId,
      restaurantId,
      tableId,
      createdByUserId,
      items,
      appliedDiscounts,
      OrderStatus.PENDING,
      new Date(),
      new Date(),
    );
  }

  static reconstitute(
    orderId: string,
    restaurantId: string,
    tableId: string | null,
    createdByUserId: string,
    items: OrderItem[],
    appliedDiscounts: AppliedDiscount[],
    status: OrderStatus,
    createdAt: Date,
    updatedAt: Date,
  ): Order {
    return new Order(
      orderId,
      restaurantId,
      tableId,
      createdByUserId,
      items,
      appliedDiscounts,
      status,
      createdAt,
      updatedAt,
    );
  }

  // ============================================
  // Equality
  // ============================================

  equals(other: Order): boolean {
    return this.orderId === other.orderId;
  }
}