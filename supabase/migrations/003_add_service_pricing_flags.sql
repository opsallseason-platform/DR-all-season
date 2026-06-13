-- Add service-level pricing behavior flags.
-- Existing service names and slugs are intentionally untouched.

ALTER TABLE services
ADD COLUMN IF NOT EXISTS is_per_person BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE services
ADD COLUMN IF NOT EXISTS child_price_enabled BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN services.is_per_person IS 'When true, service price is multiplied by passenger count. When false, price is treated as a flat service price.';
COMMENT ON COLUMN services.child_price_enabled IS 'When true, child pricing and child passenger selector are available for this service.';

UPDATE services
SET is_per_person = CASE WHEN category = 'transfer' THEN false ELSE true END
WHERE is_per_person IS NULL OR category = 'transfer';

UPDATE services
SET child_price_enabled = CASE WHEN category IN ('tour', 'excursion') THEN true ELSE false END
WHERE child_price_enabled IS NULL OR category = 'transfer';
