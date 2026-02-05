export class OrderItem {
  constructor(
    public readonly orderItemId: string,  // Changed from 'id' to match schema
    public readonly orderId: string,
    public readonly itemId: string,       // Changed from 'productId' to match schema
    public readonly itemNameSnapshot: string,  // Changed from 'productName' to match schema
    public readonly quantity: number,
    public readonly unitPriceMinorSnapshot: number,  // Changed from 'unitPrice' and added 'Minor'
  ) {
    this.validate();
  }

  // ============================================
  // Getters
  // ============================================

  get lineSubtotalMinor(): number {
    return this.quantity * this.unitPriceMinorSnapshot;
  }

  get lineDiscountMinor(): number {
    // Line-level discounts can be added here in the future
    return 0;
  }

  get lineTotalMinor(): number {
    return this.lineSubtotalMinor - this.lineDiscountMinor;
  }

  // ============================================
  // Business Logic
  // ============================================

  increaseQuantity(amount: number): OrderItem {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    return new OrderItem(
      this.orderItemId,
      this.orderId,
      this.itemId,
      this.itemNameSnapshot,
      this.quantity + amount,
      this.unitPriceMinorSnapshot,
    );
  }

  decreaseQuantity(amount: number): OrderItem {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const newQuantity = this.quantity - amount;
    if (newQuantity < 1) {
      throw new Error('Quantity cannot be less than 1');
    }

    return new OrderItem(
      this.orderItemId,
      this.orderId,
      this.itemId,
      this.itemNameSnapshot,
      newQuantity,
      this.unitPriceMinorSnapshot,
    );
  }

  updateQuantity(newQuantity: number): OrderItem {
    if (newQuantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    return new OrderItem(
      this.orderItemId,
      this.orderId,
      this.itemId,
      this.itemNameSnapshot,
      newQuantity,
      this.unitPriceMinorSnapshot,
    );
  }

  // ============================================
  // Validation
  // ============================================

  private validate(): void {
    if (!this.itemId || this.itemId.trim().length === 0) {
      throw new Error('Item ID is required');
    }

    if (!this.itemNameSnapshot || this.itemNameSnapshot.trim().length === 0) {
      throw new Error('Item name is required');
    }

    if (this.quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    if (this.unitPriceMinorSnapshot < 0) {
      throw new Error('Unit price cannot be negative');
    }
  }

  // ============================================
  // Factory Methods
  // ============================================

  static create(
    orderItemId: string,
    orderId: string,
    itemId: string,
    itemNameSnapshot: string,
    quantity: number,
    unitPriceMinorSnapshot: number,
  ): OrderItem {
    return new OrderItem(
      orderItemId,
      orderId,
      itemId,
      itemNameSnapshot,
      quantity,
      unitPriceMinorSnapshot,
    );
  }

  // ============================================
  // Equality
  // ============================================

  equals(other: OrderItem): boolean {
    return this.orderItemId === other.orderItemId;
  }
}