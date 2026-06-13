-- Add child_price column to pricing_tiers table
-- This allows storing different prices for children (up to 12 years old)

ALTER TABLE pricing_tiers 
ADD COLUMN IF NOT EXISTS child_price NUMERIC(10, 2);

-- Add comment to explain the column
COMMENT ON COLUMN pricing_tiers.child_price IS 'Price per child (up to 12 years old). Typically 70% of adult price.';

-- Update existing pricing tiers to set child_price as 70% of price_per_person
UPDATE pricing_tiers 
SET child_price = ROUND(price_per_person * 0.7, 2)
WHERE child_price IS NULL;
