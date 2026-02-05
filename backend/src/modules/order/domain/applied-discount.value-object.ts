export enum DiscountType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED',
}

export class AppliedDiscount {
  constructor(
    public readonly orderDiscountId: string,
    public readonly orderId: string,
    public readonly discountId: string,
    public readonly type: DiscountType,
    public readonly value: number,  // Percentage (e.g., 20) or fixed amount in minor units
    public readonly appliedAmountMinor: number,  // Actual discount amount applied in minor units
    public readonly createdAt: Date,
  ) {
    this.validate();
  }

  // ============================================
  // Validation
  // ============================================

  private validate(): void {
    if (!this.discountId || this.discountId.trim().length === 0) {
      throw new Error('Discount ID is required');
    }

    if (this.type === DiscountType.PERCENT) {
      if (this.value < 0 || this.value > 100) {
        throw new Error('Percentage discount must be between 0 and 100');
      }
    }

    if (this.type === DiscountType.FIXED) {
      if (this.value < 0) {
        throw new Error('Fixed discount amount cannot be negative');
      }
    }

    if (this.appliedAmountMinor < 0) {
      throw new Error('Applied amount cannot be negative');
    }
  }

  // ============================================
  // Factory Methods
  // ============================================

  static create(
    orderDiscountId: string,
    orderId: string,
    discountId: string,
    type: DiscountType,
    value: number,
    appliedAmountMinor: number,
  ): AppliedDiscount {
    return new AppliedDiscount(
      orderDiscountId,
      orderId,
      discountId,
      type,
      value,
      appliedAmountMinor,
      new Date(),
    );
  }

  static reconstitute(
    orderDiscountId: string,
    orderId: string,
    discountId: string,
    type: DiscountType,
    value: number,
    appliedAmountMinor: number,
    createdAt: Date,
  ): AppliedDiscount {
    return new AppliedDiscount(
      orderDiscountId,
      orderId,
      discountId,
      type,
      value,
      appliedAmountMinor,
      createdAt,
    );
  }

  // ============================================
  // Equality
  // ============================================

  equals(other: AppliedDiscount): boolean {
    return this.orderDiscountId === other.orderDiscountId;
  }
}