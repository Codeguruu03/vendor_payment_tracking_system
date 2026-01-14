-- Drop ENUMs if they exist (ignore errors if they don't)
DROP TYPE IF EXISTS public."VendorStatus" CASCADE;
DROP TYPE IF EXISTS public."POStatus" CASCADE;
DROP TYPE IF EXISTS public."PaymentMethod" CASCADE;

-- No need to do anything else - VARCHAR/TEXT columns already exist
-- Validation will be handled at application level
