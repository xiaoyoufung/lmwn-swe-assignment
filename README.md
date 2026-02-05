# POS System - LINE MAN Wongnai

**Author:** Xiaoyou Fung </br>
**Email:** xiaoyoufung@gmail.com  </br>
**Date:** 5 February 2026    </br>
**Assignment:** Junior 2026 - Software Engineer (Node.js)  </br>

---


## Docker Setup

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Quick Start

1. **Clone and configure**
```bash
   git clone 
   cd pos-system
   cp .env.example .env
   # Edit .env with your values
```

2. **Start services**
```bash
   docker-compose up -d
```

3. **Initialize database**
```bash
   # Migrations will run automatically on startup
   # Check logs to confirm
   docker-compose logs backend | grep "Prisma"
```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Health: http://localhost:3000/health
   - Prisma Studio: `docker-compose exec backend npx prisma studio`

---

## Technology Stack
### Frontend

- **Vite**: Fast development server.

- **React**: More familiar with and have large ecosystem

- **Tailwind**: Fast UI development with consistent design

### Backend

- **Prisma** - seeding initial database data

- **Express.js** - framework for node.js

## Database: PostgreSQL

- Provides ACID compliance, which is suitable for pos system that prioritizes financial data transactions like Orders + OrderItems + Payments that must be atomic

- Relational database structure has Clear foreign key relationships, for example:
    - Orders have Items (1:N)
    - Orders have StatusHistory (1:N)

- Support complex reporting queries (JOIN orders + items + discounts)

---

## Architecture: Clean Architecture and Modular Monolith
### Why I choose this approach?
- It is suitable for a new team building a system from scratch using a Modular monolith. We can reduce operational complexity when compared to microservices.

- As we're building a POS system, the system that has clearly bounded contexts like the order module, the billing module, and the reporting module, which can extend by themselves within the monolith.

- In the future, if we have a Billing module and need independent scaling to extract its service, the clean architecture can make the extraction easier.

## ER Diagram
![Alt text](docs/ER-Diagram.svg)


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
PENDING → CONFIRMED → COMPLETED </br>
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

## Future Improvement
-   PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  Have all the status to keepstrack of kitchen work and also payment feature 

- Add authentication JWT and role base user categorize into 
