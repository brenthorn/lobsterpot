-- Add Buzz (Social Media Manager) to Mission Control agents

INSERT INTO mc_agents (
  name, 
  session_key, 
  role, 
  level, 
  emoji, 
  type,
  status
) VALUES (
  'Buzz',
  'agent:buzz:isolated',
  'Social Media Manager',
  'specialist',
  '📱',
  'agent',
  'idle'
) ON CONFLICT (session_key) DO UPDATE SET
  role = 'Social Media Manager',
  emoji = '📱',
  level = 'specialist',
  status = 'idle';

-- Verify
SELECT name, session_key, role, type, emoji, status FROM mc_agents WHERE name = 'Buzz';
