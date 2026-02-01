-- FIX v2: Mission Control RLS Policies
-- Problem: Policies were checking for jay@solisinteractive.com but Jay logs in with jklauminzer@gmail.com
-- Solution: Just check mc_admin flag for ANY authenticated user

-- Drop old policies
DROP POLICY IF EXISTS "MC admins can view agents" ON mc_agents;
DROP POLICY IF EXISTS "MC admins can modify agents" ON mc_agents;
DROP POLICY IF EXISTS "MC admins can view tasks" ON mc_tasks;
DROP POLICY IF EXISTS "MC admins can modify tasks" ON mc_tasks;
DROP POLICY IF EXISTS "MC admins can view comments" ON mc_comments;
DROP POLICY IF EXISTS "MC admins can create comments" ON mc_comments;
DROP POLICY IF EXISTS "MC admins can view activities" ON mc_activities;

-- Create working policies (check mc_admin flag for authenticated user's email)

-- MC AGENTS
CREATE POLICY "MC admins can view agents" ON mc_agents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mc_admin = true
    )
  );

CREATE POLICY "MC admins can modify agents" ON mc_agents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mc_admin = true
    )
  );

-- MC TASKS
CREATE POLICY "MC admins can view tasks" ON mc_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mc_admin = true
    )
  );

CREATE POLICY "MC admins can modify tasks" ON mc_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mc_admin = true
    )
  );

-- MC COMMENTS
CREATE POLICY "MC admins can view comments" ON mc_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mc_admin = true
    )
  );

CREATE POLICY "MC admins can create comments" ON mc_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mc_admin = true
    )
  );

-- MC ACTIVITIES
CREATE POLICY "MC admins can view activities" ON mc_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM humans 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND mc_admin = true
    )
  );

-- Verify it worked
SELECT 
  u.email as auth_email,
  h.email as human_email,
  h.mc_admin
FROM auth.users u
LEFT JOIN humans h ON h.email = u.email
WHERE u.id = auth.uid();
