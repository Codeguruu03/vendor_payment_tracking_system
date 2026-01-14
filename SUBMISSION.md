# Assignment Submission - MSME Vendor Payment Tracking System

## 📝 Brief Note

I have successfully developed a complete vendor payment tracking system using NestJS, TypeScript, Prisma, and PostgreSQL. The system implements all core requirements including vendor management, purchase order processing with line items, payment recording with validation, advanced filtering, JWT authentication, and comprehensive analytics. Additionally, all three bonus features have been implemented: payment void functionality with automatic PO status recalculation, payment trends analytics showing 6-month historical data, and a complete audit trail system tracking who created/updated records. The API is fully deployed on Render.com with interactive Swagger documentation, follows best practices with modular architecture, implements transaction safety for critical operations, and includes soft delete functionality for data preservation.

---

## 🌐 Deployed Application

**Live API URL:** https://vendor-payment-tracking-system.onrender.com

**Swagger Documentation (Interactive):** https://vendor-payment-tracking-system.onrender.com/api

**GitHub Repository:** https://github.com/Codeguruu03/vendor_payment_tracking_system

---

## 🔐 Test Credentials

### Application Login (JWT Authentication)

| Username | Password | Description |
|----------|----------|-------------|
| `admin` | `admin123` | Admin user with full access |
| `user` | `user123` | Regular user with full access |

**How to use:**
1. POST request to `/auth/login` with credentials
2. Copy the `access_token` from response
3. Use in all other requests: `Authorization: Bearer <access_token>`

### Database Credentials (PostgreSQL on Render)

| Field | Value |
|-------|-------|
| **Host** | `dpg-d5jjeip4tr6s73asepvg-a.oregon-postgres.render.com` |
| **Port** | `5432` |
| **Database** | `vendor_payment_tracking_gphj` |
| **Username** | (Available on Render Dashboard) |
| **Password** | (Available on Render Dashboard) |
| **Connection String** | `postgresql://user:password@dpg-d5jjeip4tr6s73asepvg-a.oregon-postgres.render.com/vendor_payment_tracking_gphj?schema=public` |

**Note:** Full database credentials with password are available in the Render.com dashboard under the PostgreSQL service "Internal Database URL".

---

## 📚 Documentation Files

1. **README.md** - Complete project documentation with:
   - Feature list (core + bonus)
   - Tech stack details
   - Getting started guide
   - All 19 API endpoints with examples
   - Database schema with ERD
   - Business logic explanation
   - Deployment information

2. **API_TESTING_GUIDE.md** - Comprehensive endpoint testing guide with:
   - curl examples for all endpoints
   - Request/response examples
   - Error scenarios
   - Authentication flow

3. **DEPLOYMENT_GUIDE.md** - Step-by-step deployment guide for Render.com

4. **Postman Collection** - `Vendor_Payment_Tracking_System.postman_collection.json`
   - Pre-configured environment variables
   - All 19 endpoints ready to test
   - Authentication setup included

---

## ✨ Features Implemented

### Core Requirements ✅
- ✅ Vendor Management (CRUD with unique constraints)
- ✅ Purchase Order Management (with multiple line items)
- ✅ Payment Recording (with validation and auto-status updates)
- ✅ Advanced Filtering (date range, amount range, status, vendor)
- ✅ Pagination (page/limit on all list endpoints)
- ✅ JWT Authentication (hardcoded test users as specified)
- ✅ Input Validation (using class-validator)
- ✅ Error Handling (global exception filter)
- ✅ Swagger Documentation (interactive at /api endpoint)
- ✅ Database Design (proper relationships and constraints)

### Bonus Features ✅
1. ✅ **Payment Void** - DELETE `/payments/:id` endpoint that:
   - Soft deletes payment (marks with deletedAt timestamp)
   - Recalculates PO status based on remaining payments
   - Uses database transaction for atomicity

2. ✅ **Payment Trends Analytics** - GET `/analytics/payment-trends` endpoint that:
   - Analyzes last 6 months of payment data
   - Groups by month with totals, averages, min/max amounts
   - Excludes voided payments from calculations
   - Returns summary statistics

3. ✅ **Audit Trail** - createdBy/updatedBy fields on:
   - Vendor model
   - PurchaseOrder model
   - Payment model
   - Automatically captured from JWT token
   - Tracks who created/updated each record

---

## 🔌 API Endpoints (19 Total)

### Authentication (2)
- POST `/auth/login` - Login and get JWT token
- GET `/auth/profile` - Get current user profile

### Vendors (5)
- POST `/vendors` - Create vendor
- GET `/vendors` - List all vendors (paginated)
- GET `/vendors/:id` - Get vendor details
- PATCH `/vendors/:id` - Update vendor
- DELETE `/vendors/:id` - Soft delete vendor

### Purchase Orders (5)
- POST `/purchase-orders` - Create PO with line items
- GET `/purchase-orders` - List POs (paginated + filtered)
- GET `/purchase-orders/:id` - Get PO details
- PATCH `/purchase-orders/:id/status` - Update PO status
- DELETE `/purchase-orders/:id` - Soft delete PO

### Payments (4)
- POST `/payments` - Record payment
- GET `/payments` - List payments (paginated)
- GET `/payments/:id` - Get payment details
- DELETE `/payments/:id` - **Void payment (Bonus Feature)**

### Analytics (3)
- GET `/analytics/vendor-outstanding` - Outstanding balance by vendor
- GET `/analytics/payment-aging` - Payment aging report (0-30, 31-60, 61-90, 90+ days)
- GET `/analytics/payment-trends` - **6-month trends (Bonus Feature)**

---

## 🏗 Technical Implementation

### Architecture
- **Framework:** NestJS 10.x with TypeScript 5.2.2
- **Database:** PostgreSQL 15+ with Prisma ORM 6.19.1
- **Authentication:** JWT with Passport.js
- **Validation:** class-validator decorators on DTOs
- **Documentation:** Swagger/OpenAPI

### Key Features
- Modular architecture (separate modules per domain)
- Transaction-wrapped critical operations
- Soft delete implementation (data preservation)
- Global exception filter for consistent error responses
- Input validation on all endpoints
- Audit trail on all major entities

### Database Design
- 5 models: Vendor, PurchaseOrder, LineItem, Payment, User
- Proper foreign key relationships
- Unique constraints on critical fields
- Soft delete support where needed
- Audit fields (createdBy, updatedBy, createdAt, updatedAt)

---

## 🧪 Testing Instructions

### Option 1: Using Swagger UI (Easiest)
1. Go to: https://vendor-payment-tracking-system.onrender.com/api
2. Click "Authorize" button
3. POST to `/auth/login` with `{"username":"admin","password":"admin123"}`
4. Copy the `access_token`
5. Click "Authorize" again and paste token
6. Test any endpoint!

### Option 2: Using Postman
1. Import `Vendor_Payment_Tracking_System.postman_collection.json`
2. Set environment variable `baseUrl` to `https://vendor-payment-tracking-system.onrender.com`
3. Run "Login" request first to get token
4. Token is auto-saved to environment variable
5. Test all other endpoints

### Option 3: Using cURL
See `API_TESTING_GUIDE.md` for complete curl examples.

---

## 📊 Sample Data

The database is currently empty. You can:

1. **Use Swagger UI** to create test data interactively
2. **Use Postman collection** to create sample vendors, POs, and payments
3. **Run seed script** (if you have local access):
   ```bash
   npm run prisma:seed
   ```
   This creates:
   - 5 sample vendors
   - 12+ purchase orders
   - 10+ payments

---

## ✅ Assignment Completion Status

| Requirement | Status | Notes |
|------------|--------|-------|
| Vendor CRUD | ✅ Complete | With unique constraints and soft delete |
| Purchase Order Management | ✅ Complete | With line items and auto-calculations |
| Payment Recording | ✅ Complete | With validation and status updates |
| Advanced Filtering | ✅ Complete | Date range, amount range, status filters |
| Pagination | ✅ Complete | On all list endpoints |
| JWT Authentication | ✅ Complete | Hardcoded users as specified |
| Input Validation | ✅ Complete | Using class-validator |
| Error Handling | ✅ Complete | Global exception filter |
| API Documentation | ✅ Complete | Swagger + guides |
| Database Design | ✅ Complete | Proper relationships |
| **Bonus: Payment Void** | ✅ Complete | DELETE endpoint with PO recalculation |
| **Bonus: Payment Trends** | ✅ Complete | 6-month analytics |
| **Bonus: Audit Trail** | ✅ Complete | createdBy/updatedBy on all entities |

**Overall Completion: 100% (Core + All Bonuses)** 🎉

---

## 📦 Deliverables Checklist

- ✅ Live deployed API on Render.com
- ✅ Complete README.md with all documentation
- ✅ API_TESTING_GUIDE.md with examples
- ✅ DEPLOYMENT_GUIDE.md with deployment steps
- ✅ Postman collection with all endpoints
- ✅ Database credentials for testing
- ✅ Swagger documentation (live)
- ✅ GitHub repository with complete source code
- ✅ All 3 bonus features implemented

---

## 📞 Contact

**Developer:** Naman Goyal  
**GitHub:** https://github.com/Codeguruu03  
**Repository:** https://github.com/Codeguruu03/vendor_payment_tracking_system

---

**Submission Date:** January 14, 2026
#   T r i g g e r   r e d e p l o y   2 0 2 6 - 0 1 - 1 4   2 3 : 2 8 : 3 1  
 