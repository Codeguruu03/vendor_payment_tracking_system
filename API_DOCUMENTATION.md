# API Documentation - Vendor Payment Tracking System

## Base URL

**Production:** `https://vendor-payment-tracking-system.onrender.com`

**API Version:** v1.0

**Last Updated:** January 14, 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [Common Response Formats](#common-response-formats)
3. [Error Handling](#error-handling)
4. [Endpoints](#endpoints)
   - [Authentication](#authentication-endpoints)
   - [Vendors](#vendor-endpoints)
   - [Purchase Orders](#purchase-order-endpoints)
   - [Payments](#payment-endpoints)
   - [Analytics](#analytics-endpoints)

---

## Authentication

All API endpoints (except `/auth/login`) require JWT authentication.

### Getting a Token

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Token

Include the token in all subsequent requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test Credentials

| Username | Password | Description |
|----------|----------|-------------|
| `admin` | `admin123` | Admin user |
| `user` | `user123` | Regular user |

---

## Common Response Formats

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Paginated Response
```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Error Handling

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Error message or array of validation errors",
  "error": "Bad Request"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |

---

## Endpoints

## Authentication Endpoints

### 1. Login

**POST** `/auth/login`

Get JWT access token for authentication.

**Authentication Required:** No

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzM2ODQ0MjAwLCJleHAiOjE3MzY4NDc4MDB9.xxxxx"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials

---

### 2. Get Profile

**GET** `/auth/profile`

Get current authenticated user profile.

**Authentication Required:** Yes

**Response (200 OK):**
```json
{
  "username": "admin",
  "iat": 1736844200,
  "exp": 1736847800
}
```

---

## Vendor Endpoints

### 1. Create Vendor

**POST** `/vendors`

Create a new vendor.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "contactPerson": "John Smith",
  "email": "john@acme.com",
  "phone": "9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE"
}
```

**Field Validations:**
- `name` (string, required, unique): Vendor name
- `contactPerson` (string, required): Contact person name
- `email` (string, required, unique, email format): Email address
- `phone` (string, required): Phone number
- `paymentTerms` (number, required): Payment terms in days (e.g., 30 for Net 30)
- `status` (enum, required): ACTIVE | INACTIVE | BLOCKED

**Response (201 Created):**
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

**Error Responses:**
- `400 Bad Request` - Validation errors
- `409 Conflict` - Name or email already exists

---

### 2. List Vendors

**GET** `/vendors`

Get paginated list of all vendors.

**Authentication Required:** Yes

**Query Parameters:**
- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 10): Items per page

**Example Request:**
```
GET /vendors?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "contactPerson": "John Smith",
      "email": "john@acme.com",
      "phone": "9876543210",
      "paymentTerms": 30,
      "status": "ACTIVE",
      "createdBy": "admin",
      "createdAt": "2026-01-14T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 3. Get Vendor by ID

**GET** `/vendors/:id`

Get vendor details by ID with payment summary.

**Authentication Required:** Yes

**Path Parameters:**
- `id` (number): Vendor ID

**Example Request:**
```
GET /vendors/1
```

**Response (200 OK):**
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
  "paymentSummary": {
    "totalPurchaseOrders": 5,
    "totalAmount": 100000.00,
    "totalPaid": 60000.00,
    "outstandingAmount": 40000.00
  }
}
```

**Error Responses:**
- `404 Not Found` - Vendor not found

---

### 4. Update Vendor

**PATCH** `/vendors/:id`

Update vendor information.

**Authentication Required:** Yes

**Path Parameters:**
- `id` (number): Vendor ID

**Request Body (all fields optional):**
```json
{
  "contactPerson": "Jane Doe",
  "email": "jane@acme.com",
  "phone": "9876543211",
  "paymentTerms": 45,
  "status": "ACTIVE"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Acme Corporation",
  "contactPerson": "Jane Doe",
  "email": "jane@acme.com",
  "phone": "9876543211",
  "paymentTerms": 45,
  "status": "ACTIVE",
  "updatedBy": "admin",
  "updatedAt": "2026-01-14T11:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `404 Not Found` - Vendor not found
- `409 Conflict` - Email already exists

---

### 5. Delete Vendor (Soft Delete)

**DELETE** `/vendors/:id`

Soft delete a vendor (marks as deleted, doesn't remove from database).

**Authentication Required:** Yes

**Path Parameters:**
- `id` (number): Vendor ID

**Example Request:**
```
DELETE /vendors/1
```

**Response (200 OK):**
```json
{
  "message": "Vendor deleted successfully",
  "id": 1
}
```

**Error Responses:**
- `404 Not Found` - Vendor not found

---

## Purchase Order Endpoints

### 1. Create Purchase Order

**POST** `/purchase-orders`

Create a new purchase order with line items.

**Authentication Required:** Yes

**Request Body:**
```json
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

**Field Validations:**
- `vendorId` (number, required): ID of the vendor
- `items` (array, required, min: 1): Array of line items
  - `description` (string, required): Item description
  - `quantity` (number, required, min: 1): Quantity
  - `unitPrice` (number, required, min: 0): Unit price

**Auto-Calculated Fields:**
- `poNumber`: Generated in format `PO-YYYY-NNNNN` (e.g., PO-2026-00001)
- `totalAmount`: Sum of all line items (quantity × unitPrice)
- `dueDate`: PO date + vendor's payment terms
- `status`: Initially set to `DRAFT`

**Response (201 Created):**
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
  "createdAt": "2026-01-14T10:30:00.000Z",
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

**Error Responses:**
- `400 Bad Request` - Validation errors
- `404 Not Found` - Vendor not found

---

### 2. List Purchase Orders

**GET** `/purchase-orders`

Get paginated and filtered list of purchase orders.

**Authentication Required:** Yes

**Query Parameters:**
- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 10): Items per page
- `vendorId` (number, optional): Filter by vendor ID
- `status` (string, optional): Filter by status (DRAFT | APPROVED | PARTIALLY_PAID | FULLY_PAID | CANCELLED)
- `dateFrom` (string, optional, ISO date): Filter POs from this date
- `dateTo` (string, optional, ISO date): Filter POs until this date
- `amountMin` (number, optional): Minimum total amount
- `amountMax` (number, optional): Maximum total amount

**Example Request:**
```
GET /purchase-orders?page=1&limit=10&vendorId=1&status=APPROVED&dateFrom=2026-01-01&dateTo=2026-01-31&amountMin=1000&amountMax=50000
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "poNumber": "PO-2026-00001",
      "vendorId": 1,
      "vendor": {
        "id": 1,
        "name": "Acme Corporation"
      },
      "status": "APPROVED",
      "totalAmount": 10000.00,
      "dueDate": "2026-02-13T10:30:00.000Z",
      "poDate": "2026-01-14T10:30:00.000Z",
      "createdBy": "admin"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 3. Get Purchase Order by ID

**GET** `/purchase-orders/:id`

Get purchase order details with line items and payment history.

**Authentication Required:** Yes

**Path Parameters:**
- `id` (number): Purchase order ID

**Example Request:**
```
GET /purchase-orders/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "poNumber": "PO-2026-00001",
  "vendorId": 1,
  "vendor": {
    "id": 1,
    "name": "Acme Corporation",
    "contactPerson": "John Smith"
  },
  "status": "PARTIALLY_PAID",
  "totalAmount": 10000.00,
  "dueDate": "2026-02-13T10:30:00.000Z",
  "poDate": "2026-01-14T10:30:00.000Z",
  "createdBy": "admin",
  "updatedBy": "admin",
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
  ],
  "payments": [
    {
      "id": 1,
      "amount": 5000.00,
      "method": "BANK_TRANSFER",
      "paymentDate": "2026-01-14T00:00:00.000Z",
      "referenceNumber": "TXN123456",
      "createdBy": "admin"
    }
  ],
  "paymentSummary": {
    "totalPaid": 5000.00,
    "outstandingAmount": 5000.00
  }
}
```

**Error Responses:**
- `404 Not Found` - Purchase order not found

---

### 4. Update Purchase Order Status

**PATCH** `/purchase-orders/:id/status`

Update purchase order status.

**Authentication Required:** Yes

**Path Parameters:**
- `id` (number): Purchase order ID

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

**Valid Status Values:**
- `DRAFT`: Initial state
- `APPROVED`: Approved and ready for payment
- `PARTIALLY_PAID`: Some payments made
- `FULLY_PAID`: Fully paid
- `CANCELLED`: Cancelled

**Response (200 OK):**
```json
{
  "id": 1,
  "poNumber": "PO-2026-00001",
  "status": "APPROVED",
  "updatedBy": "admin",
  "updatedAt": "2026-01-14T11:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid status
- `404 Not Found` - Purchase order not found

---

### 5. Delete Purchase Order

**DELETE** `/purchase-orders/:id`

Soft delete a purchase order.

**Authentication Required:** Yes

**Path Parameters:**
- `id` (number): Purchase order ID

**Response (200 OK):**
```json
{
  "message": "Purchase order deleted successfully",
  "id": 1
}
```

**Error Responses:**
- `404 Not Found` - Purchase order not found

---

## Payment Endpoints

### 1. Record Payment

**POST** `/payments`

Record a new payment against a purchase order.

**Authentication Required:** Yes

**Request Body:**
```json
{
  "poId": 1,
  "amount": 5000.00,
  "method": "BANK_TRANSFER",
  "paymentDate": "2026-01-14",
  "referenceNumber": "TXN123456",
  "notes": "First installment payment"
}
```

**Field Validations:**
- `poId` (number, required): Purchase order ID
- `amount` (number, required, min: 0.01): Payment amount
- `method` (enum, required): CASH | CHEQUE | BANK_TRANSFER | CREDIT_CARD
- `paymentDate` (string, required, ISO date): Payment date
- `referenceNumber` (string, optional): Payment reference/transaction ID
- `notes` (string, optional): Additional notes

**Business Rules:**
- Cannot pay against DRAFT purchase orders
- Payment amount cannot exceed outstanding amount
- PO status automatically updates based on payment:
  - If total paid < total amount → `PARTIALLY_PAID`
  - If total paid = total amount → `FULLY_PAID`

**Response (201 Created):**
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
  "createdAt": "2026-01-14T10:45:00.000Z",
  "purchaseOrder": {
    "id": 1,
    "poNumber": "PO-2026-00001",
    "status": "PARTIALLY_PAID",
    "totalAmount": 10000.00,
    "paidAmount": 5000.00,
    "outstandingAmount": 5000.00
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors or overpayment attempt
- `404 Not Found` - Purchase order not found

---

### 2. List Payments

**GET** `/payments`

Get paginated list of all payments.

**Authentication Required:** Yes

**Query Parameters:**
- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 10): Items per page

**Example Request:**
```
GET /payments?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "purchaseOrderId": 1,
      "amount": 5000.00,
      "method": "BANK_TRANSFER",
      "paymentDate": "2026-01-14T00:00:00.000Z",
      "referenceNumber": "TXN123456",
      "notes": "First installment payment",
      "createdBy": "admin",
      "createdAt": "2026-01-14T10:45:00.000Z",
      "purchaseOrder": {
        "poNumber": "PO-2026-00001",
        "vendor": {
          "name": "Acme Corporation"
        }
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 3. Get Payment by ID

**GET** `/payments/:id`

Get payment details by ID.

**Authentication Required:** Yes

**Path Parameters:**
- `id` (number): Payment ID

**Example Request:**
```
GET /payments/1
```

**Response (200 OK):**
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
  "updatedBy": "admin",
  "createdAt": "2026-01-14T10:45:00.000Z",
  "updatedAt": "2026-01-14T10:45:00.000Z",
  "deletedAt": null,
  "purchaseOrder": {
    "id": 1,
    "poNumber": "PO-2026-00001",
    "totalAmount": 10000.00,
    "vendor": {
      "name": "Acme Corporation"
    }
  }
}
```

**Error Responses:**
- `404 Not Found` - Payment not found

---

### 4. Void Payment (Bonus Feature)

**DELETE** `/payments/:id`

Void a payment (soft delete) and recalculate purchase order status.

**Authentication Required:** Yes

**Path Parameters:**
- `id` (number): Payment ID

**Example Request:**
```
DELETE /payments/1
```

**What It Does:**
- Marks payment as deleted (soft delete with `deletedAt` timestamp)
- Recalculates purchase order status based on remaining active payments
- Uses database transaction to ensure data consistency
- Updates PO status:
  - If no remaining payments → `DRAFT` or `APPROVED`
  - If partial payment remains → `PARTIALLY_PAID`
  - If fully paid after other payments → `FULLY_PAID`

**Response (200 OK):**
```json
{
  "message": "Payment voided successfully",
  "voidedPayment": {
    "id": 1,
    "amount": 5000.00,
    "deletedAt": "2026-01-14T11:00:00.000Z"
  },
  "updatedPurchaseOrder": {
    "id": 1,
    "poNumber": "PO-2026-00001",
    "previousStatus": "PARTIALLY_PAID",
    "newStatus": "APPROVED",
    "totalAmount": 10000.00,
    "remainingPaid": 0.00,
    "outstandingAmount": 10000.00
  }
}
```

**Error Responses:**
- `404 Not Found` - Payment not found or already voided

---

## Analytics Endpoints

### 1. Vendor Outstanding Balance

**GET** `/analytics/vendor-outstanding`

Get outstanding balance for each vendor.

**Authentication Required:** Yes

**Example Request:**
```
GET /analytics/vendor-outstanding
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "vendorId": 1,
      "vendorName": "Acme Corporation",
      "totalPurchaseOrders": 5,
      "totalAmount": 100000.00,
      "totalPaid": 60000.00,
      "outstandingAmount": 40000.00
    },
    {
      "vendorId": 2,
      "vendorName": "Tech Solutions Inc",
      "totalPurchaseOrders": 3,
      "totalAmount": 50000.00,
      "totalPaid": 50000.00,
      "outstandingAmount": 0.00
    }
  ],
  "summary": {
    "totalVendors": 2,
    "totalOutstanding": 40000.00
  }
}
```

---

### 2. Payment Aging Report

**GET** `/analytics/payment-aging`

Get payment aging analysis in buckets (0-30, 31-60, 61-90, 90+ days overdue).

**Authentication Required:** Yes

**Example Request:**
```
GET /analytics/payment-aging
```

**Response (200 OK):**
```json
{
  "asOfDate": "2026-01-14T00:00:00.000Z",
  "aging": [
    {
      "bucket": "0-30 days",
      "count": 5,
      "totalAmount": 25000.00,
      "purchaseOrders": [
        {
          "poNumber": "PO-2026-00001",
          "vendorName": "Acme Corporation",
          "dueDate": "2026-02-13",
          "daysOverdue": 0,
          "outstandingAmount": 5000.00
        }
      ]
    },
    {
      "bucket": "31-60 days",
      "count": 3,
      "totalAmount": 15000.00,
      "purchaseOrders": []
    },
    {
      "bucket": "61-90 days",
      "count": 1,
      "totalAmount": 8000.00,
      "purchaseOrders": []
    },
    {
      "bucket": "90+ days",
      "count": 2,
      "totalAmount": 20000.00,
      "purchaseOrders": []
    }
  ],
  "summary": {
    "totalOverdue": 11,
    "totalOverdueAmount": 68000.00
  }
}
```

---

### 3. Payment Trends (Bonus Feature)

**GET** `/analytics/payment-trends`

Get payment trends for the last 6 months with monthly analysis.

**Authentication Required:** Yes

**Example Request:**
```
GET /analytics/payment-trends
```

**What It Provides:**
- Monthly payment totals for last 6 months
- Average payment amount per month
- Minimum and maximum payment amounts
- Payment count per month
- Overall summary statistics
- Excludes voided payments from calculations

**Response (200 OK):**
```json
{
  "period": "Last 6 Months",
  "startDate": "2025-08-01T00:00:00.000Z",
  "endDate": "2026-01-31T23:59:59.999Z",
  "data": [
    {
      "month": "2025-08",
      "year": 2025,
      "totalAmount": 50000.00,
      "count": 8,
      "averageAmount": 6250.00,
      "minAmount": 2000.00,
      "maxAmount": 15000.00
    },
    {
      "month": "2025-09",
      "year": 2025,
      "totalAmount": 75000.00,
      "count": 12,
      "averageAmount": 6250.00,
      "minAmount": 3000.00,
      "maxAmount": 20000.00
    },
    {
      "month": "2025-10",
      "year": 2025,
      "totalAmount": 60000.00,
      "count": 10,
      "averageAmount": 6000.00,
      "minAmount": 2500.00,
      "maxAmount": 18000.00
    },
    {
      "month": "2025-11",
      "year": 2025,
      "totalAmount": 45000.00,
      "count": 7,
      "averageAmount": 6428.57,
      "minAmount": 3000.00,
      "maxAmount": 12000.00
    },
    {
      "month": "2025-12",
      "year": 2025,
      "totalAmount": 55000.00,
      "count": 9,
      "averageAmount": 6111.11,
      "minAmount": 2000.00,
      "maxAmount": 16000.00
    },
    {
      "month": "2026-01",
      "year": 2026,
      "totalAmount": 15000.00,
      "count": 4,
      "averageAmount": 3750.00,
      "minAmount": 2000.00,
      "maxAmount": 6000.00
    }
  ],
  "summary": {
    "totalAmount": 300000.00,
    "totalCount": 50,
    "overallAverage": 6000.00,
    "averageMonthly": 50000.00,
    "highestMonth": {
      "month": "2025-09",
      "amount": 75000.00
    },
    "lowestMonth": {
      "month": "2026-01",
      "amount": 15000.00
    }
  }
}
```

---

## Data Models

### Vendor
```typescript
{
  id: number
  name: string (unique)
  contactPerson: string
  email: string (unique)
  phone: string
  paymentTerms: number (days)
  status: "ACTIVE" | "INACTIVE" | "BLOCKED"
  createdBy: string
  updatedBy: string
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime | null
}
```

### Purchase Order
```typescript
{
  id: number
  poNumber: string (unique, auto-generated)
  vendorId: number
  status: "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "FULLY_PAID" | "CANCELLED"
  totalAmount: number (auto-calculated)
  dueDate: DateTime (auto-calculated)
  poDate: DateTime
  createdBy: string
  updatedBy: string
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime | null
}
```

### Line Item
```typescript
{
  id: number
  purchaseOrderId: number
  description: string
  quantity: number
  unitPrice: number
}
```

### Payment
```typescript
{
  id: number
  reference: string (unique, auto-generated)
  purchaseOrderId: number
  amountPaid: number
  paymentDate: DateTime
  method: "CASH" | "CHEQUE" | "BANK_TRANSFER" | "CREDIT_CARD"
  notes: string | null
  createdBy: string
  updatedBy: string
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime | null
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. The API is open for testing purposes.

---

## Pagination

All list endpoints support pagination with the following query parameters:

- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page

Response includes `meta` object with pagination details:
```json
{
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Support

For issues or questions, please contact the development team or create an issue on the GitHub repository.

**Repository:** https://github.com/Codeguruu03/vendor_payment_tracking_system

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026
