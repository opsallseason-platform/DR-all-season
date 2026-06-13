-- Update child price age wording in the database column comment.

COMMENT ON COLUMN pricing_tiers.child_price IS 'Price per child (up to 12 years old). Typically 70% of adult price.';
