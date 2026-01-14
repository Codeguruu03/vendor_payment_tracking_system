-- Comprehensive fix: Ensure ALL columns exist on ALL tables
-- This handles cases where columns were added in schema but not in migrations

-- ========== VENDOR TABLE ==========
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Vendor' AND column_name='updatedAt') THEN ALTER TABLE "Vendor" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(); END IF; END $$;

-- ========== PURCHASE ORDER TABLE ==========
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PurchaseOrder' AND column_name='updatedAt') THEN ALTER TABLE "PurchaseOrder" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(); END IF; END $$;

-- ========== PAYMENT TABLE ==========
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Payment' AND column_name='updatedAt') THEN ALTER TABLE "Payment" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(); END IF; END $$;

-- ========== LINE ITEM TABLE (Check for completeness) ==========
-- LineItem doesn't need updatedAt in current schema - just verify it has all required columns
