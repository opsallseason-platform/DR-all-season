-- Add label column to pricing_tiers to support multiple named packages per service
-- e.g., "1 Dolphin 50min Swim", "2 Dolphin Swim 1hr", "Pet the Dolphin Only"

ALTER TABLE pricing_tiers
ADD COLUMN IF NOT EXISTS label TEXT;

COMMENT ON COLUMN pricing_tiers.label IS 'Display name for the pricing package/option (e.g., "1 Dolphin 50min Swim"). NULL means single-price service.';
