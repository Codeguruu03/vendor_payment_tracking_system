-- Add missing audit columns to Vendor table
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;

-- Add missing audit columns to PurchaseOrder table
ALTER TABLE "PurchaseOrder" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "PurchaseOrder" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;

-- Add missing audit and soft delete columns to Payment table
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
