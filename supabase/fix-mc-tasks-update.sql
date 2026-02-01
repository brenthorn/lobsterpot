-- Fix MC Tasks & Activities RLS for drag and drop
-- Problem: Task UPDATE works but trigger can't INSERT into mc_activities

-- 1. Fix mc_tasks policies (split FOR ALL into specific operations)
DROP POLICY IF EXISTS "MC admins can modify tasks" ON mc_tasks;

CREATE POLICY "MC admins can insert tasks" ON mc_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

CREATE POLICY "MC admins can update tasks" ON mc_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

CREATE POLICY "MC admins can delete tasks" ON mc_tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

-- 2. Allow INSERT into mc_activities (needed by trigger_log_task_status_change)
DROP POLICY IF EXISTS "MC admins can create activities" ON mc_activities;

CREATE POLICY "MC admins can insert activities" ON mc_activities
  FOR INSERT WITH CHECK (
    -- Allow inserts from triggers (no auth context) OR from MC admins
    current_user = 'postgres' OR
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );
