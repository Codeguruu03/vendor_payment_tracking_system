-- Add updatedAt to PurchaseOrder if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='PurchaseOrder' AND column_name='updatedAt'
    ) THEN
        ALTER TABLE "PurchaseOrder" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();
    END IF;
END $$;

-- Add updatedAt to Payment if missing  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='Payment' AND column_name='updatedAt'
    ) THEN
        ALTER TABLE "Payment" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();
    END IF;
END $$;
