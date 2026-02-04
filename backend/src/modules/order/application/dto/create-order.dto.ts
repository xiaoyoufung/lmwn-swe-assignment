import { DiscountType } from "../../domain/discount.value-object";

export interface CreateOrderItemDto {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDiscountDto {
  type: DiscountType;
  value: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  discount?: CreateOrderDiscountDto;
}