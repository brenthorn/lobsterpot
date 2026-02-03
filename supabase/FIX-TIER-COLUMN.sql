-- Fix: Add missing tier columns to accounts table
-- Run this in Supabase SQL Editor BEFORE running other migrations

-- Check if column exists first, add if not
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts' AND column_name = 'tier'
  ) THEN
    ALTER TABLE accounts ADD COLUMN tier VARCHAR(20) DEFAULT 'solo';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts' AND column_name = 'tier_expires_at'
  ) THEN
    ALTER TABLE accounts ADD COLUMN tier_expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- Verify
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'accounts' 
ORDER BY ordinal_position;
