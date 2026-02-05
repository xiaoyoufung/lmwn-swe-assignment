# Intern - Software Engineer (Node.js) Assignment

##  Run project

1. install all dependencies
```
npm install
```

## Technology
Frontend
- Vite + React.js + Tailwind.css

Backend
- TypeScript
- Prisma - seeding initial database data
- Express.js

Devops
- Docker

## Architecture 
Clean Architecture and a Modular Monolith (with TypeScript)
reference. https://medium.com/@mwwtstq/building-a-scalable-express-api-using-clean-architecture-and-a-modular-monolith-with-typescript-c855614b05dc


## User Requirements

Full requirements available in machine readable format: [URS.csv](./docs/URS-Full.csv)

## Features Implemented

### Core (High Priority)
**Order Management**
- [ ] Create orders with items and discounts (URS-02)
- [ ] Automatic total calculation (URS-03)
- [ ] Input validation with error messages (URS-05)
- [ ] View order list (URS-01)

**Order Status**
- [ ] Change status through workflow (URS-06)
- [ ] Prevent invalid transitions (URS-07)
- [ ] Cancel orders with reason (URS-08)

**Reporting**
- [ ] Daily sales summary (URS-12)

### Supporting (Medium Priority)
- [ ] Order detail view (URS-04)
- [ ] Status history audit trail (URS-09)
- [ ] Filter orders by status (URS-10)
- [ ] Hourly sales breakdown (URS-13)
- [ ] Custom date range reports (URS-14)

### Future Enhancements (Low Priority)
- [ ] Status count dashboard (URS-11)


## Domain Rules

### Money Handling
- All amounts stored as integers in minor units (satang: 1 baht = 100 satang)
- Prevents floating-point precision errors in financial calculations
- Display layer converts to decimal (e.g., 10050 → 100.50 baht)

### Order Lifecycle
PENDING → CONFIRMED → COMPLETED
    CANCELLED (allowed from any state)

### Discount Calculation
1. Percentage discounts applied first (e.g., 10% off)
2. Fixed discounts applied second (e.g., -20 baht)
3. Round down to nearest satang
4. Final total cannot go below 0

Example: 
- Subtotal: 10050 satang (100.50 baht)
- 10% discount: -1005 satang (round down 1005.0)
- Fixed -500 satang (-5 baht)
- **Final: 8545 satang (85.45 baht)**
