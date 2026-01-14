# 🔧 Database Reset Instructions for Render

## Problem
The previous migration failed in the database and Prisma won't apply new migrations until it's resolved.

## Solution
You need to reset the PostgreSQL database on Render.

### **Option 1: Delete and Recreate Database (Recommended - 2 minutes)**

1. **Go to Render Dashboard** → Your PostgreSQL Database
2. **Click "Settings"** tab
3. **Scroll down** and click **"Delete Database"**
4. **Confirm** the deletion
5. **Create new PostgreSQL database:**
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `vendor-payment-db`
   - Database: `vendor_payment_tracking`
   - Plan: Free
   - Click **"Create Database"**
6. **Copy the new Internal Database URL**
7. **Go to Web Service Settings** → **Environment Variables**
8. **Update `DATABASE_URL`** with the new Internal URL from the PostgreSQL database
9. **Save and redeploy**

### **Option 2: Use Render PostgreSQL Shell (Advanced)**

If you want to keep the database and just reset migrations:

1. **Go to your PostgreSQL database on Render**
2. **Click "Connect"** → **"Postgres Shell"**
3. **Run this command:**
   ```sql
   DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20260113123911_init_schema';
   ```
4. **Exit** the shell
5. **Go back to Web Service** → Click **"Redeploy"**

---

## Why This Happens
- The initial migration had MySQL syntax
- Prisma tried to apply it to PostgreSQL and failed
- Render's database recorded this as a failed migration
- Prisma won't proceed until the failure is resolved

## What We Fixed
✅ Converted all migrations to PostgreSQL syntax
✅ Combined all features into one clean migration
✅ Ready to deploy after database reset

**Choose Option 1 (delete/recreate) if unsure - it's simpler and guaranteed to work!**
