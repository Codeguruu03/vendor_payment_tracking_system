# 🧪 API Testing Guide

## All Endpoints with Examples & Expected Responses

---

## **Base URL**
- Local: `http://localhost:3000`
- Production: `https://your-app.onrender.com`

---

## **1. AUTHENTICATION**

### 1.1 Login (Get JWT Token)
**No authentication required**

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDUyMzQ1Njd9.xyz...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Alternative User:**
```json
{
  "username": "user",
  "password": "user123"
}
```

---

## **2. VENDORS**

### 2.1 Create Vendor
**Requires JWT**

```http
POST /vendors
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "TechCorp Industries",
  "contactPerson": "Jane Smith",
  "email": "jane@techcorp.com",
  "phone": "9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE"
}
```

**Expected Response (201 Created):**
```json
{
  "id": 6,
  "name": "TechCorp Industries",
  "contactPerson": "Jane Smith",
  "email": "jane@techcorp.com",
  "phone": "9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE",
  "deletedAt": null,
  "createdBy": "admin",
  "updatedBy": "admin",
  "createdAt": "2026-01-14T10:30:00.000Z",
  "updatedAt": "2026-01-14T10:30:00.000Z"
}
```

**Error Cases:**
```json
// 409 Conflict - Duplicate Name
{
  "statusCode": 409,
  "message": "Vendor with name \"TechCorp Industries\" already exists",
  "error": "Conflict"
}

// 409 Conflict - Duplicate Email
{
  "statusCode": 409,
  "message": "Vendor with email \"jane@techcorp.com\" already exists",
  "error": "Conflict"
}

// 400 Bad Request - Invalid Email
{
  "statusCode": 400,
  "message": ["Please provide a valid email address"],
  "error": "Bad Request"
}

// 400 Bad Request - Invalid Payment Terms
{
  "statusCode": 400,
  "message": ["Payment terms must be one of: 7, 15, 30, 45, or 60 days"],
  "error": "Bad Request"
}
```

---

### 2.2 List All Vendors (Paginated)
```http
GET /vendors?page=1&limit=10
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
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
      "updatedBy": "admin",
      "createdAt": "2026-01-13T08:00:00.000Z",
      "updatedAt": "2026-01-13T08:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### 2.3 Get Vendor Details (with Payment Summary)
```http
GET /vendors/1
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Acme Corporation",
  "contactPerson": "John Smith",
  "email": "john@acme.com",
  "phone": "9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE",
  "deletedAt": null,
  "createdBy": "admin",
  "updatedBy": "admin",
  "createdAt": "2026-01-13T08:00:00.000Z",
  "updatedAt": "2026-01-13T08:00:00.000Z",
  "paymentSummary": {
    "totalPurchaseOrders": 3,
    "totalAmount": 15000,
    "totalPaid": 7500,
    "outstandingAmount": 7500
  }
}
```

**Error: 404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Vendor with ID 999 not found",
  "error": "Not Found"
}
```

---

### 2.4 Update Vendor
```http
PUT /vendors/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "contactPerson": "John Doe Updated",
  "phone": "9999999999",
  "status": "INACTIVE"
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Acme Corporation",
  "contactPerson": "John Doe Updated",
  "email": "john@acme.com",
  "phone": "9999999999",
  "paymentTerms": 30,
  "status": "INACTIVE",
  "updatedBy": "admin",
  "updatedAt": "2026-01-14T11:00:00.000Z"
}
```

---

### 2.5 Soft Delete Vendor
```http
DELETE /vendors/1
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Acme Corporation",
  "deletedAt": "2026-01-14T11:15:00.000Z"
}
```

---

## **3. PURCHASE ORDERS**

### 3.1 Create Purchase Order
**Auto-calculates: totalAmount, poNumber, dueDate**

```http
POST /purchase-orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": 1,
  "items": [
    {
      "description": "Steel Beams - Grade A",
      "quantity": 100,
      "unitPrice": 150.50
    },
    {
      "description": "Steel Plates - 10mm",
      "quantity": 50,
      "unitPrice": 200.00
    }
  ]
}
```

**Expected Response (201 Created):**
```json
{
  "id": 13,
  "poNumber": "PO-20260114-001",
  "vendorId": 1,
  "poDate": "2026-01-14T00:00:00.000Z",
  "totalAmount": 25050,
  "dueDate": "2026-02-13T00:00:00.000Z",
  "status": "APPROVED",
  "createdBy": "admin",
  "updatedBy": "admin",
  "createdAt": "2026-01-14T11:20:00.000Z",
  "updatedAt": "2026-01-14T11:20:00.000Z",
  "items": [
    {
      "id": 45,
      "description": "Steel Beams - Grade A",
      "quantity": 100,
      "unitPrice": 150.5
    },
    {
      "id": 46,
      "description": "Steel Plates - 10mm",
      "quantity": 50,
      "unitPrice": 200
    }
  ],
  "vendor": {
    "id": 1,
    "name": "Acme Corporation",
    "contactPerson": "John Smith"
  }
}
```

**Calculations:**
- `totalAmount` = (100 × 150.50) + (50 × 200.00) = 25,050
- `dueDate` = poDate + vendor.paymentTerms (30 days)
- `poNumber` = PO-YYYYMMDD-XXX (auto-generated)

**Error: 404 Vendor Not Found**
```json
{
  "statusCode": 404,
  "message": "Vendor with ID 999 not found",
  "error": "Not Found"
}
```

**Error: 400 Inactive Vendor**
```json
{
  "statusCode": 400,
  "message": "Cannot create PO for inactive vendor. Activate the vendor first.",
  "error": "Bad Request"
}
```

---

### 3.2 List Purchase Orders (with Filters)
```http
GET /purchase-orders?page=1&limit=10
GET /purchase-orders?vendorId=1
GET /purchase-orders?status=APPROVED
GET /purchase-orders?dateFrom=2026-01-01&dateTo=2026-01-31
GET /purchase-orders?amountMin=5000&amountMax=20000
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "poNumber": "PO-20260113-001",
      "vendorId": 1,
      "poDate": "2026-01-13T00:00:00.000Z",
      "totalAmount": 10000,
      "dueDate": "2026-02-12T00:00:00.000Z",
      "status": "PARTIALLY_PAID",
      "createdBy": "admin",
      "updatedBy": "admin",
      "vendor": {
        "id": 1,
        "name": "Acme Corporation",
        "contactPerson": "John Smith"
      },
      "items": [...],
      "_count": {
        "payments": 2
      }
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "hasMore": true
  }
}
```

---

### 3.3 Get PO Details (with Payment History)
```http
GET /purchase-orders/1
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "poNumber": "PO-20260113-001",
  "vendorId": 1,
  "poDate": "2026-01-13T00:00:00.000Z",
  "totalAmount": 10000,
  "dueDate": "2026-02-12T00:00:00.000Z",
  "status": "PARTIALLY_PAID",
  "createdBy": "admin",
  "updatedBy": "admin",
  "vendor": {
    "id": 1,
    "name": "Acme Corporation",
    "contactPerson": "John Smith",
    "email": "john@acme.com"
  },
  "items": [
    {
      "id": 1,
      "description": "Steel Beams",
      "quantity": 100,
      "unitPrice": 50
    },
    {
      "id": 2,
      "description": "Cement Bags",
      "quantity": 100,
      "unitPrice": 50
    }
  ],
  "payments": [
    {
      "id": 1,
      "reference": "PAY-20260113-001",
      "amountPaid": 3000,
      "paymentDate": "2026-01-13T00:00:00.000Z",
      "method": "UPI",
      "notes": "First payment"
    },
    {
      "id": 2,
      "reference": "PAY-20260113-002",
      "amountPaid": 2000,
      "paymentDate": "2026-01-13T00:00:00.000Z",
      "method": "NEFT",
      "notes": "Second payment"
    }
  ],
  "summary": {
    "totalPaid": 5000,
    "outstandingAmount": 5000,
    "paymentCount": 2
  }
}
```

---

### 3.4 Update PO Status
```http
PATCH /purchase-orders/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED"
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "poNumber": "PO-20260113-001",
  "status": "APPROVED",
  "updatedBy": "admin",
  "vendor": {
    "id": 1,
    "name": "Acme Corporation"
  }
}
```

---

## **4. PAYMENTS**

### 4.1 Record Payment
**Auto-updates PO status, prevents overpayment**

```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "poId": 1,
  "amount": 3000,
  "method": "UPI",
  "notes": "Partial payment via UPI"
}
```

**Expected Response (201 Created):**
```json
{
  "payment": {
    "id": 3,
    "reference": "PAY-20260114-001",
    "purchaseOrderId": 1,
    "amountPaid": 3000,
    "paymentDate": "2026-01-14T11:30:00.000Z",
    "method": "UPI",
    "notes": "Partial payment via UPI",
    "deletedAt": null,
    "createdBy": "admin",
    "createdAt": "2026-01-14T11:30:00.000Z"
  },
  "poStatus": "PARTIALLY_PAID",
  "summary": {
    "poTotalAmount": 10000,
    "previouslyPaid": 5000,
    "currentPayment": 3000,
    "totalPaid": 8000,
    "outstandingAmount": 2000
  }
}
```

**Complete Payment:**
```json
{
  "poId": 1,
  "amount": 2000,
  "method": "NEFT",
  "notes": "Final payment"
}

// Response:
{
  "payment": {...},
  "poStatus": "FULLY_PAID",  // ✅ Auto-updated
  "summary": {
    "poTotalAmount": 10000,
    "previouslyPaid": 8000,
    "currentPayment": 2000,
    "totalPaid": 10000,
    "outstandingAmount": 0
  }
}
```

**Error: 400 Overpayment**
```json
{
  "statusCode": 400,
  "message": "Payment amount (5000) exceeds outstanding amount (2000). Overpayment is not allowed.",
  "error": "Bad Request"
}
```

**Error: 400 DRAFT PO**
```json
{
  "statusCode": 400,
  "message": "Cannot record payment for a DRAFT PO. Approve the PO first.",
  "error": "Bad Request"
}
```

**Error: 400 Already Fully Paid**
```json
{
  "statusCode": 400,
  "message": "PO is already fully paid. No more payments are allowed.",
  "error": "Bad Request"
}
```

---

### 4.2 List All Payments (Paginated)
**Excludes voided payments**

```http
GET /payments?page=1&limit=10
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "reference": "PAY-20260113-001",
      "purchaseOrderId": 1,
      "amountPaid": 3000,
      "paymentDate": "2026-01-13T00:00:00.000Z",
      "method": "UPI",
      "notes": "First payment",
      "deletedAt": null,
      "createdBy": "admin",
      "createdAt": "2026-01-13T08:30:00.000Z",
      "purchaseOrder": {
        "id": 1,
        "poNumber": "PO-20260113-001",
        "totalAmount": 10000,
        "vendor": {
          "id": 1,
          "name": "Acme Corporation"
        }
      }
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### 4.3 Get Payment Details
```http
GET /payments/1
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "reference": "PAY-20260113-001",
  "purchaseOrderId": 1,
  "amountPaid": 3000,
  "paymentDate": "2026-01-13T00:00:00.000Z",
  "method": "UPI",
  "notes": "First payment",
  "deletedAt": null,
  "createdBy": "admin",
  "createdAt": "2026-01-13T08:30:00.000Z",
  "purchaseOrder": {
    "id": 1,
    "poNumber": "PO-20260113-001",
    "vendorId": 1,
    "totalAmount": 10000,
    "status": "PARTIALLY_PAID",
    "vendor": {
      "id": 1,
      "name": "Acme Corporation",
      "email": "john@acme.com"
    },
    "paymentSummary": {
      "totalPaid": 8000,
      "outstandingAmount": 2000,
      "paymentCount": 3
    }
  }
}
```

---

### 4.4 Void Payment (DELETE) ✅ NEW
**Soft deletes payment and recalculates PO status**

```http
DELETE /payments/1
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "voidedPayment": {
    "id": 1,
    "reference": "PAY-20260113-001",
    "amountPaid": 3000,
    "deletedAt": "2026-01-14T12:00:00.000Z"
  },
  "poStatus": "PARTIALLY_PAID",
  "summary": {
    "poTotalAmount": 10000,
    "totalPaid": 5000,
    "outstandingAmount": 5000,
    "paymentCount": 2
  }
}
```

**Verify voided payment is excluded:**
```http
GET /payments
// Payment ID 1 will NOT appear in the list
```

**Error: 404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Payment with ID 999 not found",
  "error": "Not Found"
}
```

---

## **5. ANALYTICS**

### 5.1 Vendor Outstanding Balance
**Shows outstanding amount grouped by vendor**

```http
GET /analytics/vendor-outstanding
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "summary": {
    "totalOutstanding": 45000,
    "totalVendors": 5,
    "vendorsWithOutstanding": 4
  },
  "vendors": [
    {
      "vendorId": 1,
      "vendorName": "Acme Corporation",
      "contactPerson": "John Smith",
      "totalPurchaseOrders": 3,
      "totalPOAmount": 15000,
      "totalPaid": 7500,
      "outstandingAmount": 7500,
      "status": "ACTIVE"
    },
    {
      "vendorId": 2,
      "vendorName": "Global Supplies Ltd",
      "contactPerson": "Jane Doe",
      "totalPurchaseOrders": 2,
      "totalPOAmount": 20000,
      "totalPaid": 5000,
      "outstandingAmount": 15000,
      "status": "ACTIVE"
    }
  ]
}
```

---

### 5.2 Payment Aging Report
**Aging buckets: 0-30, 31-60, 61-90, 90+ days**

```http
GET /analytics/payment-aging
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "summary": {
    "current": {
      "count": 3,
      "totalOutstanding": 15000
    },
    "days31to60": {
      "count": 2,
      "totalOutstanding": 10000
    },
    "days61to90": {
      "count": 1,
      "totalOutstanding": 5000
    },
    "over90": {
      "count": 0,
      "totalOutstanding": 0
    },
    "totalOutstanding": 30000
  },
  "aging": {
    "current": [
      {
        "poId": 1,
        "poNumber": "PO-20260114-001",
        "vendorId": 1,
        "vendorName": "Acme Corporation",
        "totalAmount": 10000,
        "totalPaid": 5000,
        "outstanding": 5000,
        "dueDate": "2026-02-13T00:00:00.000Z",
        "daysOverdue": 0
      }
    ],
    "days31to60": [...],
    "days61to90": [...],
    "over90": []
  }
}
```

---

### 5.3 Payment Trends (Last 6 Months) ✅ NEW
**Monthly payment analysis**

```http
GET /analytics/payment-trends
Authorization: Bearer <token>
```

**Expected Response (200 OK):**
```json
{
  "summary": {
    "period": "2025-07-14 to 2026-01-14",
    "totalPayments": 24,
    "totalAmount": 125000,
    "averagePayment": 5208.33,
    "highestMonth": {
      "month": "2025-12",
      "paymentCount": 6,
      "totalAmount": 28000,
      "averagePayment": 4666.67
    },
    "lowestMonth": {
      "month": "2025-08",
      "paymentCount": 2,
      "totalAmount": 8000,
      "averagePayment": 4000
    }
  },
  "trends": [
    {
      "month": "2025-08",
      "paymentCount": 2,
      "totalAmount": 8000,
      "averagePayment": 4000,
      "payments": [
        {
          "id": 1,
          "reference": "PAY-20250815-001",
          "amount": 5000,
          "method": "UPI",
          "poNumber": "PO-20250810-001",
          "vendorName": "Acme Corporation",
          "paymentDate": "2025-08-15T00:00:00.000Z"
        },
        {
          "id": 2,
          "reference": "PAY-20250820-001",
          "amount": 3000,
          "method": "NEFT",
          "poNumber": "PO-20250812-001",
          "vendorName": "Global Supplies Ltd",
          "paymentDate": "2025-08-20T00:00:00.000Z"
        }
      ]
    },
    {
      "month": "2025-09",
      "paymentCount": 4,
      "totalAmount": 18000,
      "averagePayment": 4500,
      "payments": [...]
    }
  ]
}
```

---

## **6. ERROR RESPONSES**

### 401 Unauthorized
**Missing or invalid JWT token**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Vendor with ID 999 not found",
  "error": "Not Found",
  "timestamp": "2026-01-14T12:00:00.000Z",
  "path": "/vendors/999"
}
```

### 400 Bad Request (Validation Error)
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "Please provide a valid email address",
    "Payment terms must be one of: 7, 15, 30, 45, or 60 days"
  ],
  "error": "Bad Request",
  "timestamp": "2026-01-14T12:00:00.000Z",
  "path": "/vendors"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Vendor with email \"test@example.com\" already exists",
  "error": "Conflict",
  "timestamp": "2026-01-14T12:00:00.000Z",
  "path": "/vendors"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "timestamp": "2026-01-14T12:00:00.000Z",
  "path": "/vendors"
}
```

---

## **7. TESTING WORKFLOW**

### Complete Test Scenario

```bash
# 1. Login
POST /auth/login
→ Get token

# 2. Create Vendor
POST /vendors
→ vendorId: 6

# 3. Create PO for that vendor
POST /purchase-orders { vendorId: 6, items: [...] }
→ poId: 13, totalAmount: 10000, status: APPROVED

# 4. Make partial payment
POST /payments { poId: 13, amount: 4000 }
→ status changes to PARTIALLY_PAID

# 5. Check PO status
GET /purchase-orders/13
→ status: PARTIALLY_PAID, outstanding: 6000

# 6. Make another payment
POST /payments { poId: 13, amount: 6000 }
→ status changes to FULLY_PAID

# 7. Try to overpay (should fail)
POST /payments { poId: 13, amount: 1000 }
→ 400 Error: PO is already fully paid

# 8. Void a payment
DELETE /payments/3
→ status recalculates to PARTIALLY_PAID

# 9. Check analytics
GET /analytics/vendor-outstanding
GET /analytics/payment-aging
GET /analytics/payment-trends

# 10. Update vendor
PUT /vendors/6 { status: "INACTIVE" }

# 11. Try to create PO for inactive vendor (should fail)
POST /purchase-orders { vendorId: 6 }
→ 400 Error: Cannot create PO for inactive vendor
```

---

## **8. POSTMAN COLLECTION**

Import this into Postman:

```json
{
  "info": {
    "name": "Vendor Payment Tracking API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}"
      }
    ]
  }
}
```

---

**🎯 All endpoints documented with examples, expected responses, and error cases!**

Use Swagger UI at `/api` for interactive testing.
