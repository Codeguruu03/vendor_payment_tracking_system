-- CreateEnum for VendorStatus
CREATE TYPE "VendorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum for POStatus
CREATE TYPE "POStatus" AS ENUM ('DRAFT', 'APPROVED', 'PARTIALLY_PAID', 'FULLY_PAID', 'CANCELLED');

-- CreateEnum for PaymentMethod
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CHEQUE', 'BANK_TRANSFER', 'CREDIT_CARD');

-- AlterTable - Vendor
ALTER TABLE "Vendor" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Vendor" ALTER COLUMN "status" TYPE "VendorStatus" USING "status"::"VendorStatus";
ALTER TABLE "Vendor" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable - PurchaseOrder
ALTER TABLE "PurchaseOrder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PurchaseOrder" ALTER COLUMN "status" TYPE "POStatus" USING "status"::"POStatus";
ALTER TABLE "PurchaseOrder" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable - Payment
ALTER TABLE "Payment" ALTER COLUMN "method" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "method" TYPE "PaymentMethod" USING "method"::"PaymentMethod";
ALTER TABLE "Payment" ALTER COLUMN "method" SET NOT NULL;
