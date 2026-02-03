-- Add Jay as assignable team member in Mission Control
-- This allows Jay to assign tasks to himself and makes MC the single source of truth

-- Option 1: Add 'type' field to mc_agents (cleaner)
ALTER TABLE mc_agents ADD COLUMN IF NOT EXISTS type text DEFAULT 'agent';
-- Types: 'agent' | 'human'

-- Add Jay as a team member
INSERT INTO mc_agents (
  name, 
  session_key, 
  role, 
  level, 
  emoji, 
  type,
  status
) VALUES (
  'Jay',
  'human:jay:main',
  'CEO & Product',
  'lead',
  '👨‍💼',
  'human',
  'active'
) ON CONFLICT (session_key) DO UPDATE SET
  type = 'human',
  emoji = '👨‍💼';

-- Update existing agents to have type='agent'
UPDATE mc_agents 
SET type = 'agent' 
WHERE type IS NULL AND session_key LIKE 'agent:%';

-- Verify
SELECT name, session_key, role, type, emoji FROM mc_agents ORDER BY type, name;
