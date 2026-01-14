-- Complete schema fix: add ALL missing columns from init_schema that weren't applied
-- This handles cases where tables exist but were created before Prisma migrations

-- Add status to Vendor if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='Vendor' AND column_name='status'
    ) THEN
        ALTER TABLE "Vendor" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';
    END IF;
END $$;

-- Add audit columns to Vendor
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Vendor' AND column_name='createdBy') THEN
        ALTER TABLE "Vendor" ADD COLUMN "createdBy" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Vendor' AND column_name='updatedBy') THEN
        ALTER TABLE "Vendor" ADD COLUMN "updatedBy" TEXT;
    END IF;
END $$;

-- Add status to PurchaseOrder if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='PurchaseOrder' AND column_name='status'
    ) THEN
        ALTER TABLE "PurchaseOrder" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'DRAFT';
    END IF;
END $$;

-- Add audit columns to PurchaseOrder
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PurchaseOrder' AND column_name='createdBy') THEN
        ALTER TABLE "PurchaseOrder" ADD COLUMN "createdBy" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='PurchaseOrder' AND column_name='updatedBy') THEN
        ALTER TABLE "PurchaseOrder" ADD COLUMN "updatedBy" TEXT;
    END IF;
END $$;

-- Add method to Payment if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='Payment' AND column_name='method'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "method" TEXT NOT NULL DEFAULT 'BANK_TRANSFER';
    END IF;
END $$;

-- Add audit and soft delete columns to Payment
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Payment' AND column_name='deletedAt') THEN
        ALTER TABLE "Payment" ADD COLUMN "deletedAt" TIMESTAMP(3);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='Payment' AND column_name='createdBy') THEN
        ALTER TABLE "Payment" ADD COLUMN "createdBy" TEXT;
    END IF;
END $$;
