-- @mentions support for comments
-- Tracks who was mentioned so agents/users can be notified

-- Add mentions column to comments
ALTER TABLE mc_comments ADD COLUMN IF NOT EXISTS mentions jsonb DEFAULT '[]';

-- GIN index for efficient "find comments mentioning agent X" queries
CREATE INDEX IF NOT EXISTS idx_comments_mentions ON mc_comments USING gin(mentions);

-- Example mention structure:
-- [
--   {"type": "agent", "id": "uuid-here", "name": "Bonnie"},
--   {"type": "user", "id": "uuid-here", "name": "Jay"}
-- ]
