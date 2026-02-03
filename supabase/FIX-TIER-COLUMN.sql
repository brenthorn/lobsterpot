-- Fix: Add missing tier columns to BOTH accounts AND agent_templates
-- Run this in Supabase SQL Editor BEFORE running 003-hub.sql

-- Fix accounts table
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

-- Fix agent_templates table (if it exists without tier column)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'agent_templates'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_templates' AND column_name = 'tier'
  ) THEN
    ALTER TABLE agent_templates ADD COLUMN tier VARCHAR(20) DEFAULT 'free';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'agent_templates'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_templates' AND column_name = 'model_tier'
  ) THEN
    ALTER TABLE agent_templates ADD COLUMN model_tier VARCHAR(20) DEFAULT 'standard';
  END IF;
END $$;

-- Verify both tables
SELECT 'accounts' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'accounts' AND column_name IN ('tier', 'tier_expires_at')
UNION ALL
SELECT 'agent_templates' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agent_templates' AND column_name IN ('tier', 'model_tier')
ORDER BY table_name, column_name;
