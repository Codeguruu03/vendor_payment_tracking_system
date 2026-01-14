-- CreateEnum for VendorStatus
CREATE TYPE public."VendorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum for POStatus
CREATE TYPE public."POStatus" AS ENUM ('DRAFT', 'APPROVED', 'PARTIALLY_PAID', 'FULLY_PAID', 'CANCELLED');

-- CreateEnum for PaymentMethod
CREATE TYPE public."PaymentMethod" AS ENUM ('CASH', 'CHEQUE', 'BANK_TRANSFER', 'CREDIT_CARD');

-- AlterTable - Vendor
ALTER TABLE public."Vendor" ALTER COLUMN "status" TYPE public."VendorStatus" USING "status"::text::public."VendorStatus";

-- AlterTable - PurchaseOrder  
ALTER TABLE public."PurchaseOrder" ALTER COLUMN "status" TYPE public."POStatus" USING "status"::text::public."POStatus";

-- AlterTable - Payment
ALTER TABLE public."Payment" ALTER COLUMN "method" TYPE public."PaymentMethod" USING "method"::text::public."PaymentMethod";
