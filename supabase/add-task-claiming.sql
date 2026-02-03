-- Add task claiming columns for multi-gateway support
-- This allows multiple gateways to coordinate without double-processing tasks

-- Add claiming columns to mc_tasks
ALTER TABLE mc_tasks ADD COLUMN IF NOT EXISTS claimed_by_gateway VARCHAR(100);
ALTER TABLE mc_tasks ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

-- Index for efficient claim queries
CREATE INDEX IF NOT EXISTS idx_mc_tasks_claimed ON mc_tasks(claimed_by_gateway);
CREATE INDEX IF NOT EXISTS idx_mc_tasks_unclaimed ON mc_tasks(status) WHERE claimed_by_gateway IS NULL;

-- Function to safely claim a task (atomic operation)
CREATE OR REPLACE FUNCTION claim_task(
  p_task_id UUID,
  p_gateway_id VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
  claimed_count INTEGER;
BEGIN
  -- Attempt to claim (only if unclaimed)
  UPDATE mc_tasks
  SET 
    claimed_by_gateway = p_gateway_id,
    claimed_at = NOW(),
    status = 'in_progress'
  WHERE id = p_task_id
    AND claimed_by_gateway IS NULL
    AND status IN ('assigned', 'inbox');
  
  GET DIAGNOSTICS claimed_count = ROW_COUNT;
  
  RETURN claimed_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to release a claim (for retries or reassignment)
CREATE OR REPLACE FUNCTION release_task_claim(
  p_task_id UUID,
  p_gateway_id VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
  released_count INTEGER;
BEGIN
  UPDATE mc_tasks
  SET 
    claimed_by_gateway = NULL,
    claimed_at = NULL,
    status = 'assigned'
  WHERE id = p_task_id
    AND claimed_by_gateway = p_gateway_id;
  
  GET DIAGNOSTICS released_count = ROW_COUNT;
  
  RETURN released_count > 0;
END;
$$ LANGUAGE plpgsql;

-- View for unclaimed tasks (convenient for orchestrators)
CREATE OR REPLACE VIEW unclaimed_tasks AS
SELECT *
FROM mc_tasks
WHERE claimed_by_gateway IS NULL
  AND status IN ('assigned', 'inbox')
ORDER BY 
  CASE priority 
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'normal' THEN 3
    WHEN 'low' THEN 4
  END,
  created_at ASC;

COMMENT ON COLUMN mc_tasks.claimed_by_gateway IS 'Gateway ID that claimed this task (NULL = unclaimed)';
COMMENT ON COLUMN mc_tasks.claimed_at IS 'When the task was claimed';
COMMENT ON FUNCTION claim_task IS 'Atomically claim a task for processing';
COMMENT ON FUNCTION release_task_claim IS 'Release a task claim (for retries)';
