-- This migration adds columns that should have been in init but the DB predates it
-- DO block ensures idempotency (won't fail if column already exists)

-- Add status to Vendor if missing (init_schema has it but DB might not)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='Vendor' AND column_name='status'
    ) THEN
        ALTER TABLE "Vendor" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';
    END IF;
END $$;

-- Add audit columns to Vendor
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vendor' AND column_name='createdBy') THEN
        ALTER TABLE "Vendor" ADD COLUMN "createdBy" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vendor' AND column_name='updatedBy') THEN
        ALTER TABLE "Vendor" ADD COLUMN "updatedBy" TEXT;
    END IF;
END $$;

-- Add audit columns to PurchaseOrder
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PurchaseOrder' AND column_name='createdBy') THEN
        ALTER TABLE "PurchaseOrder" ADD COLUMN "createdBy" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PurchaseOrder' AND column_name='updatedBy') THEN
        ALTER TABLE "PurchaseOrder" ADD COLUMN "updatedBy" TEXT;
    END IF;
END $$;

-- Add method to Payment if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='Payment' AND column_name='method'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "method" TEXT NOT NULL DEFAULT 'BANK_TRANSFER';
    END IF;
END $$;

-- Add audit and soft delete columns to Payment
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Payment' AND column_name='deletedAt') THEN
        ALTER TABLE "Payment" ADD COLUMN "deletedAt" TIMESTAMP(3);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Payment' AND column_name='createdBy') THEN
        ALTER TABLE "Payment" ADD COLUMN "createdBy" TEXT;
    END IF;
END $$;
