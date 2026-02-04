# Intern - Software Engineer (Node.js) Assignment

###  Run project

1. install all dependencies
```
npm install
```

## Domain Rules

### Money Handling
- All amounts stored as integers in minor units (satang: 1 baht = 100 satang)
- Prevents floating-point precision errors in financial calculations
- Display layer converts to decimal (e.g., 10050 → 100.50 baht)

### Order Lifecycle
PENDING → CONFIRMED → PREPARING → READY → COMPLETED
         ↓
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