-- Add frequency_per_week column to habits table
ALTER TABLE habits ADD COLUMN IF NOT EXISTS frequency_per_week INTEGER;

-- Update existing habits with default values based on frequency
UPDATE habits SET frequency_per_week = 7 WHERE frequency = 'daily' AND frequency_per_week IS NULL;
UPDATE habits SET frequency_per_week = 1 WHERE frequency = 'weekly' AND frequency_per_week IS NULL;
