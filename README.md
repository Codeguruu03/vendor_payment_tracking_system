# MSME Vendor Payment Tracking System

A robust backend API for managing vendor payments, purchase orders, and payment tracking built with **NestJS**, **TypeScript**, and **MySQL/Prisma**.

## ✨ Features

- **Vendor Management**: CRUD operations with payment summary
- **Purchase Orders**: Create, filter, and track PO with line items
- **Payment Recording**: Transaction-based payments with overpayment prevention
- **Analytics**: Vendor outstanding and payment aging reports
- **JWT Authentication**: Secure all endpoints
- **Swagger Documentation**: Interactive API docs at `/api`
- **Pagination**: All list endpoints support page/limit
- **Advanced Filtering**: Date range and amount range filters

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 10.x | Backend Framework |
| TypeScript | 5.x | Programming Language |
| Prisma | 6.x | ORM |
| MySQL | 8.x | Database |
| JWT | - | Authentication |
| Swagger | - | API Documentation |
| class-validator | 0.14.x | Request Validation |

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MySQL 8.x
- npm

### Installation

```bash
# Clone repository
git clone https://github.com/Codeguruu03/vendor_payment_tracking_system.git
cd vendor_payment_tracking_system

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# Run database migration
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed

# Start development server
npm run start:dev
```

**Server:** http://localhost:3000  
**Swagger Docs:** http://localhost:3000/api

## 🔐 Authentication

All endpoints (except login) require JWT token.

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| user | user123 | user |

### Login Example

```bash
POST /auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

Use token: `Authorization: Bearer <access_token>`

## 📚 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Get JWT token |

### Vendors
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/vendors` | Create vendor |
| GET | `/vendors` | List vendors (paginated) |
| GET | `/vendors/:id` | Get vendor with payment summary |
| PUT | `/vendors/:id` | Update vendor |
| DELETE | `/vendors/:id` | Soft delete vendor |

### Purchase Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/purchase-orders` | Create PO with line items |
| GET | `/purchase-orders` | List POs (paginated + filtered) |
| GET | `/purchase-orders/:id` | Get PO with payment history |
| PATCH | `/purchase-orders/:id/status` | Update PO status |

**Filters for GET /purchase-orders:**
- `page`, `limit` - Pagination
- `vendorId` - Filter by vendor
- `status` - Filter by status (DRAFT, APPROVED, PARTIALLY_PAID, FULLY_PAID)
- `dateFrom`, `dateTo` - Date range filter
- `amountMin`, `amountMax` - Amount range filter

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments` | Record payment |
| GET | `/payments` | List payments (paginated) |
| GET | `/payments/:id` | Get payment details |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/vendor-outstanding` | Outstanding by vendor |
| GET | `/analytics/payment-aging` | Aging report (0-30, 31-60, 61-90, 90+ days) |

## 📝 Example Requests

### Create Vendor
```json
POST /vendors
{
  "name": "Acme Corporation",
  "contactPerson": "John Smith",
  "email": "john@acme.com",
  "phone": "9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE"
}
```

### Create Purchase Order
```json
POST /purchase-orders
{
  "vendorId": 1,
  "items": [
    { "description": "Steel Rods", "quantity": 100, "unitPrice": 50 },
    { "description": "Steel Plates", "quantity": 50, "unitPrice": 100 }
  ]
}
```

### Record Payment
```json
POST /payments
{
  "poId": 1,
  "amount": 2500,
  "method": "UPI",
  "notes": "First installment"
}
```

**Payment Methods:** CASH, CHEQUE, NEFT, RTGS, UPI

## 🎯 Business Logic

1. **Vendor uniqueness**: Name and email must be unique
2. **PO auto-calculations**: 
   - PO Number: `PO-YYYYMMDD-XXX`
   - Total = Sum of line items
   - Due Date = PO Date + Payment Terms
3. **Payment rules**:
   - Cannot pay DRAFT POs
   - Cannot overpay (amount ≤ outstanding)
   - Auto-updates PO status

## 🗃 Database Schema

```
Vendor (1) ──────< PurchaseOrder (1) ──────< Payment
                         │
                         └──────< LineItem
```

## 🧪 Scripts

```bash
npm run start:dev    # Development
npm run build        # Build
npm run prisma:seed  # Seed database
npm run prisma:studio # DB GUI
```

## 📄 License

MIT
