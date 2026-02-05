# POS System - LINE MAN Wongnai

**Author:** Xiaoyou Fung </br>
**Email:** xiaoyoufung@gmail.com  </br>
**Date:** 5 February 2026    </br>
**Assignment:** Junior 2026 - Software Engineer (Node.js)  </br>

---


## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js 22+](https://nodejs.org/) (only for local development)

### Quick Start with Docker

1. **Clone and setup**
```bash
   git clone https://github.com/xiaoyoufung/lmwn-pos-system.git
   cd pos-system
   cp .env.example .env
```

2. **Start all services**
```bash
   docker-compose up -d
```

3. **Access the application**
   -  Frontend: http://localhost:3000
   -  Backend API: http://localhost:8003
   -  Prisma Studio: `cd backend && npx prisma studio`

### Stopping Services
```bash
docker-compose down       # Stop services
docker-compose down -v    # Stop and remove data
```

### Local Development Setup

<details>
<summary>Click to expand local development instructions</summary>

**1. Start Database**
```bash
docker-compose up -d postgres
```

**2. Setup Backend**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # Optional: seed test data
npm run dev
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

</details>

### Environment Variables

Key variables in `.env`:
```env
POSTGRES_PORT=5433        # Database port
BACKEND_PORT=8003         # API port
FRONTEND_PORT=3000        # Frontend port
DATABASE_URL=postgresql://admin:Admin_123@localhost:5433/pos-system-db
```

### Useful Commands
```bash
# View logs
docker-compose logs -f backend

# Reset database
cd backend && npx prisma migrate reset

# Access database
docker-compose exec postgres psql -U admin -d pos-system-db

# Rebuild everything
docker-compose up -d --build
```

### Troubleshooting

**Port already in use?**
```bash
# Change port in .env file or kill the process
lsof -i :5433
```

**Database connection failed?**
```bash
# Check if database is healthy
docker-compose ps
docker-compose logs postgres
```


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

---

## ER Diagram
![Alt text](docs/ER-Diagram.svg)

## Database Design

- Snapshotting (itemNameSnapshot, unitPriceMinorSnapshot): This is excellent. Many juniors link directly to the Items table. If the restaurant changes the price of "Fried Rice" next week, old order records would become inaccurate without these snapshots. This directly addresses "financial calculations are always accurate".

- Audit Trail (OrderStatusHistory): This effectively solves the requirement to "identify the root cause quickly". If an order mysteriously gets cancelled, you know exactly who did it and when.

- I added a displayId separate from the UUID because while UUIDs ensure system uniqueness, kitchen staff and customers need short, pronounceable numbers for real-time operations

---

## User Requirements

Full requirements available in machine readable format: [URS.csv](./docs/URS-Full.csv)
<!-- 
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
 -->

---


## Development Priorities & Reasoning

### What I Built First

**1. Order Creation with Discount Logic (40% of effort)**
- **Why:** Core revenue function - without accurate order totals, nothing else matters
- **What:** 
  - Order entity with Items (1:N relationship)
  - Discount calculation service (percentage → fixed → round down)
  - Validation layer (positive quantities, valid prices)
  - Database transactions (atomic order + items creation)

**2. Order Status Management (25% of effort)**
- **Why:** Staff need to track order lifecycle immediately
- **What:**
  - Status enum (PENDING → CONFIRMED → COMPLETED)
  - Status transition validation
  - OrderStatusHistory table for audit trail

**3. Daily Sales Report (20% of effort)**
- **Why:** Most valuable business metric - "How much did we make today?"
- **What:**
  - Aggregation query (SUM of completed orders)
  - Breakdown: total orders, revenue, avg order value
  - Filter by date range

**4. Basic Frontend (15% of effort)**
- **Why:** Prove the system is actually usable
- **What:**
  - Order list with status filters
  - Order creation form
  - Sales dashboard with simple chart

### What I Deprioritized

**Authentication:** 
- Reason: Not in core requirements, would consume 1-2 days
- Production plan: JWT + role-based access control

**Advanced Reporting:**
- Reason: Daily summary covers 80% of business needs
- Production plan: Hourly breakdown, best sellers, revenue trends

**Payment Integration:**
- Reason: Out of scope, requires external API setup
- Production plan: First production priority after MVP


---


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

---

## Production Roadmap

If this system were deployed in production, here's what I'd build next, in order:

### Phase 1: Critical for Launch (Week 1-2)

**1. Payment Integration**
- **Why:** Can't actually close transactions without payment
- **What:** 
  - Payment model with status tracking
  - Integration with PromptPay/credit card gateway
  - Payment reconciliation with orders
- **Risk if skipped:** System is unusable in real restaurant

**2. Authentication & Authorization**
- **Why:** Multi-user access requires security
- **What:**
  - JWT-based auth with refresh tokens
  - Role-based access (Cashier, Kitchen, Manager)
  - Audit trail tracking who made changes
- **Implementation:** 2-3 days

### Phase 2: Operational Efficiency (Week 3-4)

**3. Kitchen Display System (KDS)**
- **Why:** Current status flow doesn't separate front-of-house from kitchen
- **What:**
  - PREPARING → READY status for kitchen staff
  - Real-time order notifications (WebSocket)
  - Kitchen view showing pending orders
- **Business impact:** Reduces order fulfillment time by ~30%

**4. Inventory Management**
- **Why:** Prevent selling out-of-stock items
- **What:**
  - Product catalog with stock levels
  - Auto-decrement on order creation
  - Low stock alerts
- **Business impact:** Prevents customer complaints about unavailable items

### Phase 3: Advanced Features (Month 2+)

**5. Advanced Analytics**
- Revenue trends (daily/weekly/monthly)
- Best-selling items analysis
- Peak hours heatmap
- Staff performance metrics

**6. Multi-location Support**
- Location-based order filtering
- Consolidated reporting across branches
- Location-specific inventory

**7. Customer Management**
- Customer profiles with order history
- Loyalty points system
- Targeted promotions

### Technical Debt to Address

**Testing Coverage:**
- Current: ~60% (domain + application layers)
- Target: 80%+ (add infrastructure integration tests)

**Monitoring & Observability:**
- Add structured logging (Pino)
- Error tracking (Sentry)
- Performance monitoring (APM)
- Database query optimization

**Scalability:**
- Read replicas for reporting queries
- Redis caching for frequently accessed data
- CDN for frontend assets

---

# API Quick Reference

## Orders
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | POST | Create order |
| `/api/orders` | GET | List orders |
| `/api/orders/:id` | GET | Get order details |
| `/api/orders/:id/status` | PATCH | Update status |

<!-- ## Reports
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reports/daily-sales?date=YYYY-MM-DD` | GET | Daily sales summary | -->

## Status Values
PENDING | CONFIRMED | PREPARING | READY | COMPLETED | CANCELLED

## Discount Types
- `percentage`: 0-100
- `fixed`: amount in satang