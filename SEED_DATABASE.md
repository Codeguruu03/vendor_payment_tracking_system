# Database Seeding Guide

Your database is hosted on Render.com. To seed it with sample data, follow these steps:

## Option 1: Seed via Render Shell (Recommended)

1. **Go to Render Dashboard:**
   - Visit https://render.com
   - Go to your PostgreSQL database instance

2. **Open Shell:**
   - Click on your database → "Shell" tab
   - This gives you direct database access

3. **Run Seed Command:**
   ```bash
   # From your application's Render service, add this to your build command:
   npm install --legacy-peer-deps && npx prisma generate && npm run build && npx prisma db seed
   ```

## Option 2: Seed via Local Machine (Requires Database URL)

1. **Get Database URL from Render:**
   - Go to your PostgreSQL instance on Render
   - Copy the "Internal Database URL" or "External Database URL"

2. **Update .env locally:**
   ```
   DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
   ```

3. **Run seed command:**
   ```bash
   npm run prisma:seed
   ```

## Option 3: Add Seed to Render Deploy (Automatic)

Update your `package.json` build script on Render to include seeding:

In your Render service settings, set:
- **Build Command:** `npm install --legacy-peer-deps && npx prisma generate && npm run build`
- **Start Command:** `npx prisma migrate deploy && npm run prisma:seed && npm run start:prod`

This will automatically seed the database on every deployment.

---

## Sample Data Created

The seed script creates:
- **5 Vendors** (Acme Corporation, Global Supplies Ltd, Tech Parts India, Expert Services, Quality Traders)
- **10 Purchase Orders** with varying statuses (DRAFT, APPROVED, PARTIALLY_PAID, FULLY_PAID)
- **15 Payments** with different payment methods (CASH, CHEQUE, BANK_TRANSFER, CREDIT_CARD)
- **Analytics data** for trends and reporting

All data includes proper audit fields (createdBy, updatedBy) and timestamps.

---

## Verify Seeding

After seeding, check the data by:

1. **Using Postman:**
   - Import the Postman collection
   - GET `/vendors` should return 5 vendors
   - GET `/purchase-orders` should return 10 purchase orders
   - GET `/analytics/vendor-outstanding` should show outstanding balances

2. **Using API:**
   ```bash
   curl -H "Authorization: Bearer <your_jwt_token>" \
        https://vendor-payment-tracking-system.onrender.com/vendors
   ```

3. **Using Prisma Studio:**
   ```bash
   npx prisma studio
   ```
