# MSME Vendor Payment Tracking System

A comprehensive backend API for managing vendor payments, purchase orders, and payment tracking built with **NestJS**, **TypeScript**, **Prisma**, and **PostgreSQL**.

## 🌐 Live Deployment

**API Base URL:** https://vendor-payment-tracking-system.onrender.com  
**Interactive API Docs (Swagger):** https://vendor-payment-tracking-system.onrender.com/api

**Test Credentials:**
- Username: `admin` | Password: `admin123`
- Username: `user` | Password: `user123`

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Business Logic](#-business-logic)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Core Features
- ✅ **Vendor Management** - CRUD operations with contact info, payment terms, and status tracking
- ✅ **Purchase Order Management** - Create POs with multiple line items, auto-calculate totals and due dates
- ✅ **Payment Recording** - Record payments with method tracking and overpayment prevention
- ✅ **Payment History** - Track all payments against purchase orders with audit trail
- ✅ **Advanced Filtering** - Date range, amount range, status, and vendor filters on POs
- ✅ **Pagination** - All list endpoints support pagination (page/limit)
- ✅ **Soft Deletes** - Records are marked as deleted, not removed from database
- ✅ **Transaction Safety** - Database transactions ensure data consistency

### Bonus Features (All Implemented)
- ✅ **Payment Void Functionality** - DELETE endpoint to void payments with automatic PO status recalculation
- ✅ **Payment Trends Analytics** - 6-month payment analysis with monthly totals and averages
- ✅ **Audit Trail** - Track who created/updated records (createdBy/updatedBy fields)

### Analytics & Reporting
- 📊 **Vendor Outstanding Balance** - See outstanding amounts per vendor
- 📊 **Payment Aging Report** - Bucket analysis (0-30, 31-60, 61-90, 90+ days overdue)
- 📊 **Payment Trends** - Last 6 months analysis with totals, averages, min/max amounts

### Security & Documentation
- 🔐 **JWT Authentication** - All endpoints protected with JWT tokens
- 📚 **Swagger/OpenAPI** - Interactive API documentation at `/api`
- ✅ **Input Validation** - Request validation using class-validator decorators

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 10.x | Backend Framework (Node.js) |
| **TypeScript** | 5.2.2 | Programming Language |
| **Prisma ORM** | 6.19.1 | Database ORM & Migrations |
| **PostgreSQL** | 15+ | Relational Database |
| **Passport.js + JWT** | Latest | Authentication |
| **Swagger/OpenAPI** | 11.x | API Documentation |
| **class-validator** | 0.14.x | Request Validation |
| **dayjs** | 1.11.x | Date manipulation |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** 15+ (or use Render.com free PostgreSQL)
- **npm** or **yarn**

### Local Installation

1. **Clone the repository**
```bash
git clone https://github.com/Codeguruu03/vendor_payment_tracking_system.git
cd vendor_payment_tracking_system
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Setup environment variables**
```bash
# Copy .env.example to .env
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vendor_payment_tracking?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV=development
```

4. **Run database migrations**
```bash
npx prisma generate
npx prisma migrate deploy
```

5. **Seed database (optional)**
```bash
npm run prisma:seed
```
This creates:
- 5 sample vendors
- 12+ purchase orders
- 10+ payments

6. **Start development server**
```bash
npm run start:dev
```

**Server:** http://localhost:3000  
**Swagger Docs:** http://localhost:3000/api

---

## 📚 API Documentation

### Authentication

All endpoints (except `/auth/login`) require JWT authentication.

**Login to get JWT token:**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Use token in requests:**
```http
Authorization: Bearer <access_token>
```

---

### API Endpoints Overview

#### **Authentication**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login and get JWT token | ❌ |
| GET | `/auth/profile` | Get current user profile | ✅ |

#### **Vendors** (5 endpoints)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/vendors` | Create new vendor | ✅ |
| GET | `/vendors` | List all vendors (paginated) | ✅ |
| GET | `/vendors/:id` | Get vendor details with payment summary | ✅ |
| PATCH | `/vendors/:id` | Update vendor information | ✅ |
| DELETE | `/vendors/:id` | Soft delete vendor | ✅ |

**Query Parameters for GET /vendors:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)

#### **Purchase Orders** (5 endpoints)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/purchase-orders` | Create PO with line items | ✅ |
| GET | `/purchase-orders` | List all POs (paginated + filtered) | ✅ |
| GET | `/purchase-orders/:id` | Get PO details with line items & payments | ✅ |
| PATCH | `/purchase-orders/:id/status` | Update PO status | ✅ |
| DELETE | `/purchase-orders/:id` | Soft delete PO | ✅ |

**Query Parameters for GET /purchase-orders:**
- `page`, `limit` - Pagination
- `vendorId` (number) - Filter by vendor ID
- `status` (enum) - Filter by status: DRAFT, APPROVED, PARTIALLY_PAID, FULLY_PAID, CANCELLED
- `dateFrom` (ISO date) - Filter POs from this date
- `dateTo` (ISO date) - Filter POs until this date
- `amountMin` (number) - Minimum total amount
- `amountMax` (number) - Maximum total amount

#### **Payments** (4 endpoints)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments` | Record a payment | ✅ |
| GET | `/payments` | List all payments (paginated) | ✅ |
| GET | `/payments/:id` | Get payment details | ✅ |
| DELETE | `/payments/:id` | **Void payment (Bonus Feature)** | ✅ |

**Payment Methods:** CASH, CHEQUE, BANK_TRANSFER, CREDIT_CARD

#### **Analytics** (3 endpoints)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/vendor-outstanding` | Outstanding balance per vendor | ✅ |
| GET | `/analytics/payment-aging` | Payment aging report (0-30, 31-60, 61-90, 90+ days) | ✅ |
| GET | `/analytics/payment-trends` | **6-month payment trends (Bonus Feature)** | ✅ |

---

### Example API Requests

#### 1. Create Vendor
```http
POST /vendors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "contactPerson": "John Smith",
  "email": "john@acme.com",
  "phone": "9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Acme Corporation",
  "contactPerson": "John Smith",
  "email": "john@acme.com",
  "phone": "9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE",
  "createdBy": "admin",
  "updatedBy": "admin",
  "createdAt": "2026-01-14T10:30:00.000Z",
  "updatedAt": "2026-01-14T10:30:00.000Z",
  "deletedAt": null
}
```

#### 2. Create Purchase Order
```http
POST /purchase-orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": 1,
  "items": [
    {
      "description": "Steel Rods - 10mm",
      "quantity": 100,
      "unitPrice": 50.00
    },
    {
      "description": "Steel Plates - 2mm",
      "quantity": 50,
      "unitPrice": 100.00
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "poNumber": "PO-2026-00001",
  "vendorId": 1,
  "status": "DRAFT",
  "totalAmount": 10000.00,
  "dueDate": "2026-02-13T10:30:00.000Z",
  "poDate": "2026-01-14T10:30:00.000Z",
  "createdBy": "admin",
  "lineItems": [
    {
      "id": 1,
      "description": "Steel Rods - 10mm",
      "quantity": 100,
      "unitPrice": 50.00,
      "totalPrice": 5000.00
    },
    {
      "id": 2,
      "description": "Steel Plates - 2mm",
      "quantity": 50,
      "unitPrice": 100.00,
      "totalPrice": 5000.00
    }
  ]
}
```

#### 3. Record Payment
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "poId": 1,
  "amount": 5000.00,
  "method": "BANK_TRANSFER",
  "paymentDate": "2026-01-14",
  "referenceNumber": "TXN123456",
  "notes": "First installment payment"
}
```

**Response:**
```json
{
  "id": 1,
  "purchaseOrderId": 1,
  "amount": 5000.00,
  "method": "BANK_TRANSFER",
  "paymentDate": "2026-01-14T00:00:00.000Z",
  "referenceNumber": "TXN123456",
  "notes": "First installment payment",
  "createdBy": "admin",
  "createdAt": "2026-01-14T10:45:00.000Z"
}
```

*Note: PO status automatically updates to PARTIALLY_PAID*

#### 4. Void Payment (Bonus Feature)
```http
DELETE /payments/1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Payment voided successfully",
  "voidedPayment": {
    "id": 1,
    "deletedAt": "2026-01-14T11:00:00.000Z"
  },
  "updatedPO": {
    "id": 1,
    "status": "DRAFT"
  }
}
```

*Note: PO status recalculates based on remaining payments*

#### 5. Get Payment Trends (Bonus Feature)
```http
GET /analytics/payment-trends
Authorization: Bearer <token>
```

**Response:**
```json
{
  "period": "Last 6 Months",
  "data": [
    {
      "month": "2025-08",
      "totalAmount": 50000.00,
      "count": 8,
      "averageAmount": 6250.00,
      "minAmount": 2000.00,
      "maxAmount": 15000.00
    },
    {
      "month": "2025-09",
      "totalAmount": 75000.00,
      "count": 12,
      "averageAmount": 6250.00,
      "minAmount": 3000.00,
      "maxAmount": 20000.00
    }
  ],
  "summary": {
    "totalAmount": 300000.00,
    "totalCount": 50,
    "averageMonthly": 50000.00
  }
}
```

---

## 🗃 Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌────────────────┐         ┌──────────────┐
│    Vendor    │◄────────│ PurchaseOrder  │◄────────│   Payment    │
│              │ 1     * │                │ 1     * │              │
│ - id         │         │ - id           │         │ - id         │
│ - name       │         │ - poNumber     │         │ - reference  │
│ - email      │         │ - vendorId (FK)│         │ - poId (FK)  │
│ - phone      │         │ - totalAmount  │         │ - amount     │
│ - paymentTerms│        │ - dueDate      │         │ - method     │
│ - status     │         │ - status       │         │ - paymentDate│
│ - createdBy  │         │ - createdBy    │         │ - createdBy  │
│ - updatedBy  │         │ - updatedBy    │         │ - updatedBy  │
│ - deletedAt  │         │ - deletedAt    │         │ - deletedAt  │
└──────────────┘         └────────────────┘         └──────────────┘
                                 │
                                 │ 1
                                 │
                                 │ *
                         ┌───────────────┐
                         │   LineItem    │
                         │               │
                         │ - id          │
                         │ - poId (FK)   │
                         │ - description │
                         │ - quantity    │
                         │ - unitPrice   │
                         └───────────────┘
```

### Models

#### **Vendor**
- Primary key: `id` (SERIAL)
- Unique constraints: `name`, `email`
- Status enum: `ACTIVE`, `INACTIVE`, `BLOCKED`
- Soft delete support: `deletedAt`
- Audit fields: `createdBy`, `updatedBy`

#### **PurchaseOrder**
- Primary key: `id` (SERIAL)
- Foreign key: `vendorId` → Vendor
- Unique constraint: `poNumber`
- Status enum: `DRAFT`, `APPROVED`, `PARTIALLY_PAID`, `FULLY_PAID`, `CANCELLED`
- Soft delete support: `deletedAt`
- Audit fields: `createdBy`, `updatedBy`
- Auto-generated: `poNumber` (format: PO-YYYY-NNNNN)

#### **LineItem**
- Primary key: `id` (SERIAL)
- Foreign key: `purchaseOrderId` → PurchaseOrder
- Cascade delete: When PO is deleted, line items are deleted

#### **Payment**
- Primary key: `id` (SERIAL)
- Foreign key: `purchaseOrderId` → PurchaseOrder
- Unique constraint: `reference`
- Method enum: `CASH`, `CHEQUE`, `BANK_TRANSFER`, `CREDIT_CARD`
- Soft delete support: `deletedAt`
- Audit fields: `createdBy`, `updatedBy`

---

## 🎯 Business Logic

### 1. Vendor Management
- ✅ Unique name and email validation
- ✅ Status tracking (ACTIVE, INACTIVE, BLOCKED)
- ✅ Payment terms stored in days (Net 30, Net 60, etc.)
- ✅ Soft delete - vendors are marked deleted, not removed

### 2. Purchase Order Auto-Calculations
- ✅ **PO Number**: Auto-generated in format `PO-YYYY-NNNNN` (e.g., PO-2026-00001)
- ✅ **Total Amount**: Automatically calculated from sum of all line items
- ✅ **Due Date**: Automatically calculated as `PO Date + Vendor Payment Terms`
- ✅ **Status Transitions**:
  - `DRAFT` → Initial state
  - `APPROVED` → Ready for payment
  - `PARTIALLY_PAID` → Some payments made
  - `FULLY_PAID` → All payments complete
  - `CANCELLED` → PO cancelled

### 3. Payment Validation & Rules
- ✅ Cannot pay against DRAFT purchase orders
- ✅ Cannot overpay - amount must be ≤ outstanding balance
- ✅ Auto-update PO status:
  - If paid amount < total → `PARTIALLY_PAID`
  - If paid amount = total → `FULLY_PAID`
- ✅ Transaction-wrapped operations ensure data consistency
- ✅ Payment void recalculates PO status based on remaining payments

### 4. Soft Delete Implementation
- ✅ Records are marked with `deletedAt` timestamp, not physically removed
- ✅ Soft-deleted records excluded from all queries
- ✅ Maintains data integrity and audit history

### 5. Audit Trail (Bonus Feature)
- ✅ All create operations capture `createdBy` from JWT token
- ✅ All update operations capture `updatedBy` from JWT token
- ✅ Tracks who performed which actions for compliance

---

## 🚢 Deployment

### Deployed on Render.com

**Live API:** https://vendor-payment-tracking-system.onrender.com  
**Swagger Docs:** https://vendor-payment-tracking-system.onrender.com/api

### Deployment Architecture
- **Platform**: Render.com (Free tier)
- **Database**: PostgreSQL 15 (Render managed, 1GB storage)
- **Node Version**: 22.16.0
- **Build Command**: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && npm run start:prod`
- **Auto-deploy**: Enabled on push to `master` branch

### Environment Variables (Production)
```env
DATABASE_URL=postgresql://[provided_by_render]
JWT_SECRET=[secure_secret_key]
NODE_ENV=production
PORT=3000
```

### Deployment Steps
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

---

## 📁 Project Structure

```
vendor_payment_tracking_system/
├── src/
│   ├── analytics/              # Analytics module
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   └── analytics.module.ts
│   ├── auth/                   # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   ├── public.decorator.ts
│   │   └── dto/
│   ├── common/                 # Shared utilities
│   │   ├── dto/               # Common DTOs (pagination)
│   │   ├── filters/           # Exception filters
│   │   └── utils/             # Utility functions
│   ├── payment/                # Payment module
│   │   ├── payment.controller.ts
│   │   ├── payment.service.ts
│   │   ├── payment.module.ts
│   │   └── dto/
│   ├── prisma/                 # Prisma module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── purchase-order/         # Purchase Order module
│   │   ├── purchase-order.controller.ts
│   │   ├── purchase-order.service.ts
│   │   ├── purchase-order.module.ts
│   │   └── dto/
│   ├── vendor/                 # Vendor module
│   │   ├── vendor.controller.ts
│   │   ├── vendor.service.ts
│   │   ├── vendor.module.ts
│   │   └── dto/
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Application entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seeding
│   └── migrations/             # Database migrations
├── test/                       # E2E tests
├── .env                        # Environment variables
├── .npmrc                      # NPM configuration
├── nest-cli.json               # NestJS CLI config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies & scripts
├── README.md                   # This file
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
└── API_TESTING_GUIDE.md        # API testing examples
```

---

## 🧪 Available Scripts

```bash
# Development
npm run start:dev              # Start in development mode with watch
npm run start:debug            # Start in debug mode

# Production
npm run build                  # Build for production
npm run start:prod             # Start production build

# Database
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Create and apply migration
npm run prisma:migrate:prod    # Apply migrations in production
npm run prisma:seed            # Seed database with sample data
npm run prisma:studio          # Open Prisma Studio (DB GUI)

# Testing
npm run test                   # Run unit tests
npm run test:e2e              # Run end-to-end tests
npm run test:cov              # Run tests with coverage

# Code Quality
npm run format                 # Format code with Prettier
npm run lint                   # Lint code with ESLint
```

---

## 📖 Additional Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete guide to deploy on Render.com
- **[API Testing Guide](./API_TESTING_GUIDE.md)** - All endpoints with curl examples & responses
- **[Swagger UI](https://vendor-payment-tracking-system.onrender.com/api)** - Interactive API documentation

---

## 🎓 Assignment Completion Status

### Core Requirements
- ✅ Vendor management (CRUD)
- ✅ Purchase order management with line items
- ✅ Payment recording and tracking
- ✅ Advanced filtering and pagination
- ✅ JWT authentication
- ✅ Input validation
- ✅ Error handling
- ✅ API documentation (Swagger)
- ✅ Database design with proper relationships
- ✅ Business logic implementation

### Bonus Features (All Completed)
- ✅ **Payment Void**: DELETE endpoint to void payments with PO status recalculation
- ✅ **Payment Trends**: 6-month analytics with monthly totals and averages
- ✅ **Audit Trail**: createdBy/updatedBy fields on all major entities

### Technical Implementation
- ✅ NestJS framework with TypeScript
- ✅ Prisma ORM with PostgreSQL
- ✅ Modular architecture
- ✅ Transaction safety for critical operations
- ✅ Soft delete implementation
- ✅ Deployed on Render.com (live and accessible)

**Completion: 100% (Core + All Bonus Features)** ✅

---

## 👨‍💻 Developer

**Name:** Naman Goyal  
**GitHub:** https://github.com/Codeguruu03  
**Repository:** https://github.com/Codeguruu03/vendor_payment_tracking_system

---

## 📄 License

MIT License - feel free to use this project for learning purposes.

---

## 🙏 Acknowledgments

Built as part of QistonPe Backend API Intern Assignment.

---

**Last Updated:** January 14, 2026
