-- FIX: Mission Control RLS Policies
-- Problem: humans.id != auth.uid(), policies were failing
-- Solution: Check by email instead

-- Drop broken policies
DROP POLICY IF EXISTS "Jay can view all MC data" ON mc_agents;
DROP POLICY IF EXISTS "Jay can modify all MC data" ON mc_agents;
DROP POLICY IF EXISTS "Jay can view all MC tasks" ON mc_tasks;
DROP POLICY IF EXISTS "Jay can modify all MC tasks" ON mc_tasks;
DROP POLICY IF EXISTS "Jay can view all MC comments" ON mc_comments;
DROP POLICY IF EXISTS "Jay can view all MC activities" ON mc_activities;

-- Create working policies (check by email + mc_admin flag)

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
