-- Fix MC Tasks UPDATE permission
-- The FOR ALL policy might not be working for UPDATE specifically

-- Drop the broad policy
DROP POLICY IF EXISTS "MC admins can modify tasks" ON mc_tasks;

-- Create specific policies for each operation
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
