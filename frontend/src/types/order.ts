 // Order Types for Restaurant POS
 
 export type OrderStatus = 
   | 'PENDING' 
   | 'CONFIRMED' 
   | 'PREPARING' 
   | 'READY' 
   | 'COMPLETED' 
   | 'CANCELLED';
 
 export interface OrderItem {
   id: string;
   name: string;
   quantity: number;
   unitPrice: number; // in satang
   notes?: string;
 }
 
 export interface Discount {
   id: string;
   type: 'percentage' | 'fixed';
   value: number; // percentage (0-100) or fixed amount in satang
   description?: string;
 }
 
 export interface StatusHistoryEntry {
   id: string;
   status: OrderStatus;
   timestamp: Date;
   note?: string;
   cancelReason?: string;
 }
 
 export interface Order {
   id: string;
   orderNumber: string;
   items: OrderItem[];
   discounts: Discount[];
   subtotal: number; // in satang
   discountAmount: number; // in satang
   total: number; // in satang
   status: OrderStatus;
   statusHistory: StatusHistoryEntry[];
   createdAt: Date;
   updatedAt: Date;
   tableNumber?: string;
   customerName?: string;
 }
 
 // Valid status transitions
 export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
   PENDING: ['CONFIRMED', 'CANCELLED'],
   CONFIRMED: ['PREPARING', 'CANCELLED'],
   PREPARING: ['READY', 'CANCELLED'],
   READY: ['COMPLETED', 'CANCELLED'],
   COMPLETED: [],
   CANCELLED: [],
 };
 
 export const STATUS_LABELS: Record<OrderStatus, string> = {
   PENDING: 'Pending',
   CONFIRMED: 'Confirmed',
   PREPARING: 'Preparing',
   READY: 'Ready',
   COMPLETED: 'Completed',
   CANCELLED: 'Cancelled',
 };
 
 export const STATUS_ORDER: OrderStatus[] = [
   'PENDING',
   'CONFIRMED',
   'PREPARING',
   'READY',
   'COMPLETED',
 ];