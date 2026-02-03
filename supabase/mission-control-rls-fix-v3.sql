-- FIX v3: Mission Control RLS Policies
-- Problem: RLS policies can't query auth.users table directly (permission denied)
-- Solution: Use auth.jwt() to get email from JWT token, check mc_admin flag

-- Drop old policies
DROP POLICY IF EXISTS "MC admins can view agents" ON mc_agents;
DROP POLICY IF EXISTS "MC admins can modify agents" ON mc_agents;
DROP POLICY IF EXISTS "MC admins can view tasks" ON mc_tasks;
DROP POLICY IF EXISTS "MC admins can modify tasks" ON mc_tasks;
DROP POLICY IF EXISTS "MC admins can view comments" ON mc_comments;
DROP POLICY IF EXISTS "MC admins can create comments" ON mc_comments;
DROP POLICY IF EXISTS "MC admins can view activities" ON mc_activities;

-- Create working policies (use JWT email claim, check mc_admin)

-- MC AGENTS
CREATE POLICY "MC admins can view agents" ON mc_agents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

CREATE POLICY "MC admins can modify agents" ON mc_agents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

-- MC TASKS
CREATE POLICY "MC admins can view tasks" ON mc_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

CREATE POLICY "MC admins can modify tasks" ON mc_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

-- MC COMMENTS
CREATE POLICY "MC admins can view comments" ON mc_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

CREATE POLICY "MC admins can create comments" ON mc_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

-- MC ACTIVITIES
CREATE POLICY "MC admins can view activities" ON mc_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = auth.jwt()->>'email'
      AND mc_admin = true
    )
  );

-- Verify it worked (run this after policies are created to test)
-- SELECT 
--   auth.jwt()->>'email' as jwt_email,
--   h.email,
--   h.mc_admin
-- FROM humans h
-- WHERE h.email = auth.jwt()->>'email';
