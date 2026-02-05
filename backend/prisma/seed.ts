// prisma/seed.ts
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  
  // Delete in correct order to respect foreign key constraints
  await prisma.orderStatusHistory.deleteMany({});
  await prisma.orderDiscounts.deleteMany({});
  await prisma.orderItems.deleteMany({});
  await prisma.orders.deleteMany({});
  await prisma.discounts.deleteMany({});
  await prisma.tables.deleteMany({});
  await prisma.items.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.restaurants.deleteMany({});

  // Create Restaurants
  const restaurant1 = await prisma.restaurants.create({
    data: {
      name: 'The Golden Fork',
    },
  });

  const restaurant2 = await prisma.restaurants.create({
    data: {
      name: 'Sunset Bistro',
    },
  });

  // Create Users for Restaurant 1
  const admin1 = await prisma.users.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      name: 'Alice Admin',
      role: 'ADMIN',
    },
  });

  const manager1 = await prisma.users.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      name: 'Bob Manager',
      role: 'MANAGER',
    },
  });

  const cashier1 = await prisma.users.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      name: 'Charlie Cashier',
      role: 'CASHIER',
    },
  });

  // Create Users for Restaurant 2
  const admin2 = await prisma.users.create({
    data: {
      restaurantId: restaurant2.restaurantId,
      name: 'Diana Admin',
      role: 'ADMIN',
    },
  });

  const cashier2 = await prisma.users.create({
    data: {
      restaurantId: restaurant2.restaurantId,
      name: 'Eve Cashier',
      role: 'CASHIER',
    },
  });

  // Create Items for Restaurant 1
  const items1 = await prisma.items.createMany({
    data: [
      // Appetizers
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Caesar Salad',
        priceMinor: 895, // $8.95
        is_available: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Garlic Bread',
        priceMinor: 595, // $5.95
        is_available: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Buffalo Wings',
        priceMinor: 1295, // $12.95
        is_available: true,
      },
      // Main Courses
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Grilled Salmon',
        priceMinor: 2495, // $24.95
        is_available: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Ribeye Steak',
        priceMinor: 3495, // $34.95
        is_available: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Margherita Pizza',
        priceMinor: 1695, // $16.95
        is_available: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Chicken Alfredo',
        priceMinor: 1895, // $18.95
        is_available: true,
      },
      // Desserts
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Chocolate Lava Cake',
        priceMinor: 795, // $7.95
        is_available: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Tiramisu',
        priceMinor: 895, // $8.95
        is_available: true,
      },
      // Beverages
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Soft Drink',
        priceMinor: 295, // $2.95
        is_available: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Fresh Lemonade',
        priceMinor: 395, // $3.95
        is_available: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        name: 'Coffee',
        priceMinor: 350, // $3.50
        is_available: true,
      },
    ],
  });

  // Create Items for Restaurant 2
  const items2 = await prisma.items.createMany({
    data: [
      {
        restaurantId: restaurant2.restaurantId,
        name: 'Spring Rolls',
        priceMinor: 695, // $6.95
        is_available: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        name: 'Tom Yum Soup',
        priceMinor: 895, // $8.95
        is_available: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        name: 'Pad Thai',
        priceMinor: 1495, // $14.95
        is_available: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        name: 'Green Curry',
        priceMinor: 1595, // $15.95
        is_available: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        name: 'Mango Sticky Rice',
        priceMinor: 695, // $6.95
        is_available: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        name: 'Thai Iced Tea',
        priceMinor: 450, // $4.50
        is_available: true,
      },
    ],
  });

  // Create Tables for Restaurant 1
  const tables1 = await prisma.tables.createMany({
    data: [
      {
        restaurantId: restaurant1.restaurantId,
        tableName: 'Table 1',
        isActive: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        tableName: 'Table 2',
        isActive: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        tableName: 'Table 3',
        isActive: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        tableName: 'Table 4',
        isActive: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        tableName: 'Table 5',
        isActive: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        tableName: 'Patio A',
        isActive: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        tableName: 'Patio B',
        isActive: true,
      },
      {
        restaurantId: restaurant1.restaurantId,
        tableName: 'VIP Room',
        isActive: true,
      },
    ],
  });

  // Create Tables for Restaurant 2
  const tables2 = await prisma.tables.createMany({
    data: [
      {
        restaurantId: restaurant2.restaurantId,
        tableName: 'Table 1',
        isActive: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        tableName: 'Table 2',
        isActive: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        tableName: 'Table 3',
        isActive: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        tableName: 'Bar Seat 1',
        isActive: true,
      },
      {
        restaurantId: restaurant2.restaurantId,
        tableName: 'Bar Seat 2',
        isActive: true,
      },
    ],
  });

  // Create Discounts for Restaurant 1
  const discount1 = await prisma.discounts.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      name: 'Happy Hour 20%',
      type: 'PERCENT',
      value: 20, // 20%
      expiredAt: new Date('2026-12-31'),
      isActive: true,
    },
  });

  const discount2 = await prisma.discounts.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      name: 'Senior Discount',
      type: 'PERCENT',
      value: 15, // 15%
      expiredAt: null, // No expiration
      isActive: true,
    },
  });

  const discount3 = await prisma.discounts.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      name: '$5 Off',
      type: 'FIXED',
      value: 500, // $5.00 in minor units
      expiredAt: new Date('2026-03-31'),
      isActive: true,
    },
  });

  const discount4 = await prisma.discounts.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      name: 'VIP Member 25%',
      type: 'PERCENT',
      value: 25, // 25%
      expiredAt: null,
      isActive: true,
    },
  });

  // Create Discounts for Restaurant 2
  const discount5 = await prisma.discounts.create({
    data: {
      restaurantId: restaurant2.restaurantId,
      name: 'Lunch Special 10%',
      type: 'PERCENT',
      value: 10,
      expiredAt: new Date('2026-06-30'),
      isActive: true,
    },
  });

  const discount6 = await prisma.discounts.create({
    data: {
      restaurantId: restaurant2.restaurantId,
      name: '$10 Off Orders Above $50',
      type: 'FIXED',
      value: 1000, // $10.00 in minor units
      expiredAt: null,
      isActive: true,
    },
  });

  // Get tables and items for Restaurant 1
  const allTables = await prisma.tables.findMany({
    where: { restaurantId: restaurant1.restaurantId },
  });

  const allItems = await prisma.items.findMany({
    where: { restaurantId: restaurant1.restaurantId },
  });

  // ============================================
  // ORDER 1: Caesar Salad, Grilled Salmon, Chocolate Lava Cake
  // ============================================
  const order1Subtotal = allItems[0].priceMinor + allItems[3].priceMinor + allItems[7].priceMinor; // 895 + 2495 + 795 = 4185
  const order1Discount1 = Math.floor(order1Subtotal * 0.20); // 20% Happy Hour = 837
  const order1Discount2 = 500; // $5 off = 500
  const order1DiscountTotal = order1Discount1 + order1Discount2; // 1337
  const order1Total = order1Subtotal - order1DiscountTotal; // 2848

  const order1 = await prisma.orders.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      createdByUserId: cashier1.userId,
      tableId: allTables[0].tableId,
      status: 'CONFIRMED',
      subtotalMinor: order1Subtotal,
      discountTotalMinor: order1DiscountTotal,
      totalMinor: order1Total,
    },
  });

  // Order 1 Items
  await prisma.orderItems.createMany({
    data: [
      {
        orderId: order1.orderId,
        itemId: allItems[0].itemId, // Caesar Salad
        itemNameSnapshot: allItems[0].name,
        quantity: 1,
        unitPriceMinorSnapshot: allItems[0].priceMinor,
        lineSubtotalMinor: allItems[0].priceMinor,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[0].priceMinor,
      },
      {
        orderId: order1.orderId,
        itemId: allItems[3].itemId, // Grilled Salmon
        itemNameSnapshot: allItems[3].name,
        quantity: 1,
        unitPriceMinorSnapshot: allItems[3].priceMinor,
        lineSubtotalMinor: allItems[3].priceMinor,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[3].priceMinor,
      },
      {
        orderId: order1.orderId,
        itemId: allItems[7].itemId, // Chocolate Lava Cake
        itemNameSnapshot: allItems[7].name,
        quantity: 1,
        unitPriceMinorSnapshot: allItems[7].priceMinor,
        lineSubtotalMinor: allItems[7].priceMinor,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[7].priceMinor,
      },
    ],
  });

  // Order 1 Discounts
  await prisma.orderDiscounts.createMany({
    data: [
      {
        orderId: order1.orderId,
        discountId: discount1.discountId, // Happy Hour 20%
        type: 'PERCENT',
        value: 20,
        appliedAmountMinor: order1Discount1,
      },
      {
        orderId: order1.orderId,
        discountId: discount3.discountId, // $5 Off
        type: 'FIXED',
        value: 500,
        appliedAmountMinor: order1Discount2,
      },
    ],
  });

  // ============================================
  // ORDER 2: Ribeye Steak (x2), Garlic Bread, Coffee
  // ============================================
  const order2Subtotal = (allItems[4].priceMinor * 2) + allItems[1].priceMinor + allItems[11].priceMinor; // (3495 * 2) + 595 + 350 = 7935
  const order2Discount1 = Math.floor(order2Subtotal * 0.15); // 15% Senior Discount = 1190
  const order2Discount2 = Math.floor(order2Subtotal * 0.25); // 25% VIP Member = 1983
  const order2DiscountTotal = order2Discount1 + order2Discount2; // 3173
  const order2Total = order2Subtotal - order2DiscountTotal; // 4762

  const order2 = await prisma.orders.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      createdByUserId: manager1.userId,
      tableId: allTables[7].tableId, // VIP Room
      status: 'COMPLETED',
      subtotalMinor: order2Subtotal,
      discountTotalMinor: order2DiscountTotal,
      totalMinor: order2Total,
    },
  });

  // Order 2 Items
  await prisma.orderItems.createMany({
    data: [
      {
        orderId: order2.orderId,
        itemId: allItems[4].itemId, // Ribeye Steak
        itemNameSnapshot: allItems[4].name,
        quantity: 2,
        unitPriceMinorSnapshot: allItems[4].priceMinor,
        lineSubtotalMinor: allItems[4].priceMinor * 2,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[4].priceMinor * 2,
      },
      {
        orderId: order2.orderId,
        itemId: allItems[1].itemId, // Garlic Bread
        itemNameSnapshot: allItems[1].name,
        quantity: 1,
        unitPriceMinorSnapshot: allItems[1].priceMinor,
        lineSubtotalMinor: allItems[1].priceMinor,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[1].priceMinor,
      },
      {
        orderId: order2.orderId,
        itemId: allItems[11].itemId, // Coffee
        itemNameSnapshot: allItems[11].name,
        quantity: 1,
        unitPriceMinorSnapshot: allItems[11].priceMinor,
        lineSubtotalMinor: allItems[11].priceMinor,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[11].priceMinor,
      },
    ],
  });

  // Order 2 Discounts
  await prisma.orderDiscounts.createMany({
    data: [
      {
        orderId: order2.orderId,
        discountId: discount2.discountId, // Senior Discount 15%
        type: 'PERCENT',
        value: 15,
        appliedAmountMinor: order2Discount1,
      },
      {
        orderId: order2.orderId,
        discountId: discount4.discountId, // VIP Member 25%
        type: 'PERCENT',
        value: 25,
        appliedAmountMinor: order2Discount2,
      },
    ],
  });

  // ============================================
  // ORDER 3: Buffalo Wings, Margherita Pizza, Tiramisu
  // ============================================
  const order3Subtotal = allItems[2].priceMinor + allItems[5].priceMinor + allItems[8].priceMinor; // 1295 + 1695 + 895 = 3885
  const order3Discount1 = 500; // $5 Off = 500
  const order3Discount2 = Math.floor(order3Subtotal * 0.20); // 20% Happy Hour = 777
  const order3DiscountTotal = order3Discount1 + order3Discount2; // 1277
  const order3Total = order3Subtotal - order3DiscountTotal; // 2608

  const order3 = await prisma.orders.create({
    data: {
      restaurantId: restaurant1.restaurantId,
      createdByUserId: cashier1.userId,
      tableId: allTables[5].tableId, // Patio A
      status: 'PENDING',
      subtotalMinor: order3Subtotal,
      discountTotalMinor: order3DiscountTotal,
      totalMinor: order3Total,
    },
  });

  // Order 3 Items
  await prisma.orderItems.createMany({
    data: [
      {
        orderId: order3.orderId,
        itemId: allItems[2].itemId, // Buffalo Wings
        itemNameSnapshot: allItems[2].name,
        quantity: 1,
        unitPriceMinorSnapshot: allItems[2].priceMinor,
        lineSubtotalMinor: allItems[2].priceMinor,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[2].priceMinor,
      },
      {
        orderId: order3.orderId,
        itemId: allItems[5].itemId, // Margherita Pizza
        itemNameSnapshot: allItems[5].name,
        quantity: 1,
        unitPriceMinorSnapshot: allItems[5].priceMinor,
        lineSubtotalMinor: allItems[5].priceMinor,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[5].priceMinor,
      },
      {
        orderId: order3.orderId,
        itemId: allItems[8].itemId, // Tiramisu
        itemNameSnapshot: allItems[8].name,
        quantity: 1,
        unitPriceMinorSnapshot: allItems[8].priceMinor,
        lineSubtotalMinor: allItems[8].priceMinor,
        lineDiscountMinor: 0,
        lineTotalMinor: allItems[8].priceMinor,
      },
    ],
  });

  // Order 3 Discounts
  await prisma.orderDiscounts.createMany({
    data: [
      {
        orderId: order3.orderId,
        discountId: discount3.discountId, // $5 Off
        type: 'FIXED',
        value: 500,
        appliedAmountMinor: order3Discount1,
      },
      {
        orderId: order3.orderId,
        discountId: discount1.discountId, // Happy Hour 20%
        type: 'PERCENT',
        value: 20,
        appliedAmountMinor: order3Discount2,
      },
    ],
  });

  // ============================================
  // ORDER STATUS HISTORY
  // ============================================
  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order2.orderId,
        fromStatus: 'PENDING',
        toStatus: 'CONFIRMED',
        changedByUserId: manager1.userId,
        changedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        notes: 'Order confirmed by manager',
      },
      {
        orderId: order2.orderId,
        fromStatus: 'CONFIRMED',
        toStatus: 'COMPLETED',
        changedByUserId: cashier1.userId,
        changedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        notes: 'Payment received - Cash',
      },
    ],
  });

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('Summary:');
  console.log(`- Restaurants: 2`);
  console.log(`- Users: 5`);
  console.log(`- Menu Items: 18`);
  console.log(`- Tables: 13`);
  console.log(`- Discounts: 6`);
  console.log(`- Orders: 3 (with 3 items and 2 discounts each)`);
  console.log(`- Order Status History: 2 records`);
  console.log('');
  console.log('Restaurant IDs:');
  console.log(`- The Golden Fork: ${restaurant1.restaurantId}`);
  console.log(`- Sunset Bistro: ${restaurant2.restaurantId}`);
  console.log('');
  console.log('Order Details:');
  console.log(`- Order 1: ${order1.orderId} (CONFIRMED) - Subtotal: $${(order1Subtotal/100).toFixed(2)}, Total: $${(order1Total/100).toFixed(2)}`);
  console.log(`- Order 2: ${order2.orderId} (PAID) - Subtotal: $${(order2Subtotal/100).toFixed(2)}, Total: $${(order2Total/100).toFixed(2)}`);
  console.log(`- Order 3: ${order3.orderId} (CREATED) - Subtotal: $${(order3Subtotal/100).toFixed(2)}, Total: $${(order3Total/100).toFixed(2)}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
