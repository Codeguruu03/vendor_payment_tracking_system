-- Add audit trail fields to Vendor
ALTER TABLE `Vendor` ADD COLUMN `createdBy` VARCHAR(191);
ALTER TABLE `Vendor` ADD COLUMN `updatedBy` VARCHAR(191);

-- Add audit trail fields to PurchaseOrder
ALTER TABLE `PurchaseOrder` ADD COLUMN `createdBy` VARCHAR(191);
ALTER TABLE `PurchaseOrder` ADD COLUMN `updatedBy` VARCHAR(191);

-- Add soft delete and audit trail to Payment
ALTER TABLE `Payment` ADD COLUMN `deletedAt` DATETIME(3);
ALTER TABLE `Payment` ADD COLUMN `createdBy` VARCHAR(191);
