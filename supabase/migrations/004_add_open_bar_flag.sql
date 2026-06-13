-- Add service-level open bar flag.
-- Existing service names and slugs are intentionally untouched.

ALTER TABLE services
ADD COLUMN IF NOT EXISTS has_open_bar BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN services.has_open_bar IS 'When true, this service includes an open bar.';
