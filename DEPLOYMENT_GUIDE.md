# 🚀 Render.com Deployment Guide

## Complete Step-by-Step Deployment Instructions

---

## **Prerequisites**
- GitHub account
- Render.com account (free tier available)
- Your code pushed to GitHub repository

---

## **STEP 1: Prepare Your GitHub Repository**

### 1.1 Initialize Git (if not already done)
```bash
cd vendor_payment_tracking_system
git init
git add .
git commit -m "Initial commit with all features"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `vendor-payment-tracking-system`
3. Keep it Public or Private (both work with Render)
4. Don't initialize with README (you already have one)
5. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/vendor-payment-tracking-system.git
git branch -M main
git push -u origin main
```

---

## **STEP 2: Create PostgreSQL Database on Render**

### 2.1 Sign Up/Login to Render
- Go to https://render.com
- Sign up with GitHub (recommended for easy integration)

### 2.2 Create New PostgreSQL Database
1. Click **"New +"** button → Select **"PostgreSQL"**
2. Configure database:
   - **Name**: `vendor-payment-db`
   - **Database**: `vendor_payment_tracking`
   - **User**: `admin` (or any name)
   - **Region**: Choose closest to you
   - **Plan**: **Free** (1 GB storage, perfect for testing)
3. Click **"Create Database"**

### 2.3 Get Database Connection Details
After creation, Render shows:
- **Internal Database URL** (for connecting from your app on Render)
- **External Database URL** (for connecting from outside)
- **Hostname**, **Port**, **Database**, **Username**, **Password**

**Copy the Internal Database URL** - it looks like:
```
postgresql://admin:xxxxxxxxxxxx@dpg-xxxxx.oregon-postgres.render.com/vendor_payment_tracking?schema=public
```

---

## **STEP 3: Deploy Backend API on Render**

### 3.1 Create New Web Service
1. Click **"New +"** → Select **"Web Service"**
2. Connect your GitHub repository
3. Select your `vendor-payment-tracking-system` repo

### 3.2 Configure Build Settings
Fill in these details:

**Basic Settings:**
- **Name**: `vendor-payment-api`
- **Region**: Same as your database
- **Branch**: `main`
- **Root Directory**: (leave empty if code is in root)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**:
  ```bash
  npm install --legacy-peer-deps && npx prisma generate && npm run build
  ```

- **Start Command**:
  ```bash
  npx prisma migrate deploy && npm run start:prod
  ```

**Instance Type:**
- Select **Free** tier (512 MB RAM, enough for API)

### 3.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `<paste your Internal Database URL from Step 2.3>` | From Render MySQL |
| `JWT_SECRET` | `your-super-secret-jwt-production-key-12345` | Change to strong random string |
| `PORT` | `3000` | Default port |
| `NODE_ENV` | `production` | Production mode |

### 3.4 Deploy!
1. Click **"Create Web Service"**
2. Render will:
   - Pull code from GitHub
   - Install dependencies
   - Generate Prisma client
   - Build TypeScript
   - Run migrations
   - Start server

**Wait 3-5 minutes** for first deploy.

### 3.5 Get Your Live API URL
After successful deployment:
- Your API URL: `https://vendor-payment-api.onrender.com`
- Swagger Docs: `https://vendor-payment-api.onrender.com/api`

---

## **STEP 4: Seed Database (Optional but Recommended)**

### 4.1 Run Seed via Render Shell
1. Go to your Web Service dashboard
2. Click **"Shell"** tab
3. Run:
   ```bash
   npm run prisma:seed
   ```

This creates:
- 5 vendors
- 12+ purchase orders
- 10+ payments
- Ready-to-test data!

---

## **STEP 5: Test Your Deployed API**

### 5.1 Health Check
Open in browser:
```
https://vendor-payment-api.onrender.com
```

Should return:
```json
{
  "status": "ok",
  "message": "Vendor Payment Tracking API is running",
  "timestamp": "2026-01-14T10:30:00.000Z"
}
```

### 5.2 Access Swagger Documentation
Open:
```
https://vendor-payment-api.onrender.com/api
```

Interactive API documentation with "Try it out" buttons!

---

## **STEP 6: Testing All Endpoints**

### 6.1 Get JWT Token (Authentication)
```bash
POST https://vendor-payment-api.onrender.com/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Copy the `access_token`** - use it in all subsequent requests as:
```
Authorization: Bearer <your-token>
```

---

### 6.2 Test Vendor Management

#### Create Vendor
```bash
POST /vendors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tech Solutions Inc",
  "contactPerson": "John Doe",
  "email": "john@techsolutions.com",
  "phone": "9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE"
}
```

**Check audit trail** in response:
```json
{
  "id": 6,
  "name": "Tech Solutions Inc",
  "createdBy": "admin",  // ✅ NEW
  "updatedBy": "admin",  // ✅ NEW
  "createdAt": "2026-01-14T10:30:00.000Z"
}
```

#### List Vendors (with pagination)
```bash
GET /vendors?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Vendor Details
```bash
GET /vendors/1
Authorization: Bearer <token>
```

**Response includes payment summary:**
```json
{
  "id": 1,
  "name": "Acme Corporation",
  "paymentSummary": {
    "totalPurchaseOrders": 3,
    "totalAmount": 15000,
    "totalPaid": 7500,
    "outstandingAmount": 7500
  }
}
```

---

### 6.3 Test Purchase Orders

#### Create PO (auto-calculates total & due date)
```bash
POST /purchase-orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": 1,
  "items": [
    {
      "description": "Steel Beams",
      "quantity": 50,
      "unitPrice": 100
    },
    {
      "description": "Steel Plates",
      "quantity": 25,
      "unitPrice": 150
    }
  ]
}
```

**Response:**
```json
{
  "id": 13,
  "poNumber": "PO-20260114-001",  // Auto-generated
  "totalAmount": 8750,  // Auto-calculated: (50*100) + (25*150)
  "dueDate": "2026-02-13T00:00:00.000Z",  // poDate + 30 days
  "status": "APPROVED",
  "createdBy": "admin",  // ✅ Audit trail
  "items": [...]
}
```

#### List POs with Advanced Filtering
```bash
GET /purchase-orders?vendorId=1&status=APPROVED&page=1&limit=10
GET /purchase-orders?dateFrom=2026-01-01&dateTo=2026-01-31
GET /purchase-orders?amountMin=5000&amountMax=10000
```

---

### 6.4 Test Payment Recording

#### Record Payment
```bash
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "poId": 13,
  "amount": 4000,
  "method": "UPI",
  "notes": "First installment"
}
```

**Response:**
```json
{
  "payment": {
    "id": 11,
    "reference": "PAY-20260114-001",
    "amountPaid": 4000,
    "createdBy": "admin"  // ✅ Audit trail
  },
  "poStatus": "PARTIALLY_PAID",  // Auto-updated
  "summary": {
    "poTotalAmount": 8750,
    "previouslyPaid": 0,
    "currentPayment": 4000,
    "totalPaid": 4000,
    "outstandingAmount": 4750
  }
}
```

---

### 6.5 Test Payment Void (NEW FEATURE)

#### Void a Payment
```bash
DELETE /payments/11
Authorization: Bearer <token>
```

**Response:**
```json
{
  "voidedPayment": {
    "id": 11,
    "deletedAt": "2026-01-14T10:45:00.000Z"  // Soft deleted
  },
  "poStatus": "APPROVED",  // Recalculated!
  "summary": {
    "poTotalAmount": 8750,
    "totalPaid": 0,
    "outstandingAmount": 8750,
    "paymentCount": 0
  }
}
```

**Verify payment is excluded:**
```bash
GET /payments
# Payment 11 will NOT appear in the list (soft deleted)
```

---

### 6.6 Test Analytics Endpoints

#### Vendor Outstanding Balance
```bash
GET /analytics/vendor-outstanding
Authorization: Bearer <token>
```

**Response:**
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
      "totalPOAmount": 15000,
      "totalPaid": 7500,
      "outstandingAmount": 7500
    }
  ]
}
```

#### Payment Aging Report
```bash
GET /analytics/payment-aging
Authorization: Bearer <token>
```

**Response:**
```json
{
  "summary": {
    "current": { "count": 2, "totalOutstanding": 5000 },
    "days31to60": { "count": 1, "totalOutstanding": 3000 },
    "days61to90": { "count": 1, "totalOutstanding": 2000 },
    "over90": { "count": 0, "totalOutstanding": 0 }
  },
  "aging": {
    "current": [...],
    "days31to60": [...],
    "days61to90": [...],
    "over90": [...]
  }
}
```

#### Payment Trends (NEW FEATURE)
```bash
GET /analytics/payment-trends
Authorization: Bearer <token>
```

**Response:**
```json
{
  "summary": {
    "period": "2025-07-14 to 2026-01-14",
    "totalPayments": 24,
    "totalAmount": 125000,
    "averagePayment": 5208.33,
    "highestMonth": {
      "month": "2025-12",
      "totalAmount": 22000
    }
  },
  "trends": [
    {
      "month": "2025-08",
      "paymentCount": 3,
      "totalAmount": 8000,
      "averagePayment": 2666.67,
      "payments": [...]
    }
  ]
}
```

---

## **STEP 7: Continuous Deployment**

### Auto-Deploy on Git Push
Render automatically redeploys when you push to GitHub:

```bash
# Make changes to code
git add .
git commit -m "Add new feature"
git push origin main

# Render automatically:
# 1. Detects push
# 2. Pulls latest code
# 3. Rebuilds
# 4. Redeploys
```

**Deploy takes 2-3 minutes.**

---

## **STEP 8: Monitoring & Logs**

### View Logs
1. Go to Render dashboard
2. Select your Web Service
3. Click **"Logs"** tab
4. See real-time logs:
   ```
   [Bootstrap] Vendor Payment Tracking API is running
   [Swagger] API docs available at /api
   Server started on port 3000
   ```

### Monitor Performance
- **Metrics** tab shows CPU, Memory usage
- **Events** tab shows deploy history
- **Shell** tab for running commands

---

## **STEP 9: Custom Domain (Optional)**

### Add Your Domain
1. Go to **Settings** tab
2. Scroll to **Custom Domains**
3. Click **"Add Custom Domain"**
4. Enter: `api.yourdomain.com`
5. Update DNS records as instructed
6. SSL certificate auto-provisioned!

---

## **Complete API Endpoint Reference**

### Authentication (No JWT Required)
```
POST   /auth/login              Get JWT token
GET    /                        Health check
```

### Vendors (JWT Required)
```
POST   /vendors                 Create vendor
GET    /vendors                 List vendors (paginated)
GET    /vendors/:id             Get vendor details + payment summary
PUT    /vendors/:id             Update vendor
DELETE /vendors/:id             Soft delete vendor
```

### Purchase Orders (JWT Required)
```
POST   /purchase-orders         Create PO with line items
GET    /purchase-orders         List POs (with filters: vendor, status, date, amount)
GET    /purchase-orders/:id     Get PO details with payment history
PATCH  /purchase-orders/:id/status  Update PO status
```

### Payments (JWT Required)
```
POST   /payments                Record payment (with overpayment prevention)
GET    /payments                List payments (paginated, excludes voided)
GET    /payments/:id            Get payment details
DELETE /payments/:id            Void payment + recalculate PO status  ✅ NEW
```

### Analytics (JWT Required)
```
GET    /analytics/vendor-outstanding   Outstanding by vendor
GET    /analytics/payment-aging        Aging report (4 buckets)
GET    /analytics/payment-trends       Monthly trends (6 months)  ✅ NEW
```

### Documentation
```
GET    /api                     Swagger/OpenAPI interactive docs
```

---

## **Troubleshooting**

### Build Failed
**Check logs for:**
- Missing environment variables → Add in Render dashboard
- Prisma migration errors → Ensure DATABASE_URL is correct
- TypeScript errors → Fix in code, push to GitHub

### Database Connection Error
- Verify DATABASE_URL in environment variables
- Check MySQL database is running on Render
- Use **Internal** database URL (not external)

### 401 Unauthorized
- Ensure you're passing JWT token: `Authorization: Bearer <token>`
- Check token hasn't expired (login again)
- Verify endpoint isn't marked as @Public() accidentally

### Migration Won't Run
```bash
# Manual migration via Render Shell:
npm run prisma:migrate:prod
```

---

## **Cost & Limitations (Free Tier)**

### MySQL Database (Free)
- ✅ 500 MB storage
- ✅ 1 database
- ✅ Enough for 1000s of records
- ⚠️ Sleeps after 90 days of inactivity

### Web Service (Free)
- ✅ 512 MB RAM
- ✅ Shared CPU
- ✅ Automatic HTTPS
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ Takes 30-50 seconds to wake up

**To prevent sleep:** Use a service like UptimeRobot (free) to ping your API every 10 minutes.

---

## **Production Checklist**

Before going live:

- [ ] Change JWT_SECRET to strong random string
- [ ] Update CORS settings if needed
- [ ] Set up monitoring/alerting
- [ ] Configure custom domain
- [ ] Enable rate limiting (optional)
- [ ] Set up backup strategy for database
- [ ] Update README with live API URL
- [ ] Create Postman collection for testing
- [ ] Document API for frontend team

---

## **Support & Resources**

- **Render Docs**: https://render.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NestJS Docs**: https://docs.nestjs.com

---

**🎉 Your API is now live, production-ready, and accessible worldwide!**

**Live URLs:**
- API: `https://vendor-payment-api.onrender.com`
- Swagger: `https://vendor-payment-api.onrender.com/api`
- Health: `https://vendor-payment-api.onrender.com`

**Test Credentials:**
- Username: `admin` | Password: `admin123`
- Username: `user` | Password: `user123`

---

Need help? Check Render logs or contact support!
