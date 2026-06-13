-- Add extra_person_price column to services table for transfers
-- Transfers are typically priced for 1-4 passengers, with extra cost per additional person

ALTER TABLE services
ADD COLUMN IF NOT EXISTS extra_person_price NUMERIC(10, 2);

COMMENT ON COLUMN services.extra_person_price IS 'Price per additional passenger beyond base capacity (e.g., $10 per extra person beyond 4 pax for transfers). NULL means no extra person pricing.';
