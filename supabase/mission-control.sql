-- Mission Control Schema
-- For tracking Clyde + Bonnie agent coordination

-- ============================================
-- AGENTS
-- ============================================
CREATE TABLE mc_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  session_key text UNIQUE NOT NULL,
  role text NOT NULL,
  level text DEFAULT 'specialist', -- intern | specialist | lead
  emoji text,
  avatar_url text,
  status text DEFAULT 'idle', -- idle | active | blocked
  current_task_id uuid,
  last_heartbeat timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mc_agents_session ON mc_agents(session_key);
CREATE INDEX idx_mc_agents_status ON mc_agents(status);

-- ============================================
-- TASKS
-- ============================================
CREATE TABLE mc_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'inbox', -- inbox | assigned | in_progress | review | done | blocked
  assigned_agent_ids uuid[] DEFAULT '{}',
  created_by_agent_id uuid REFERENCES mc_agents(id),
  tags text[] DEFAULT '{}',
  priority text DEFAULT 'normal', -- low | normal | high | urgent
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX idx_mc_tasks_status ON mc_tasks(status);
CREATE INDEX idx_mc_tasks_created ON mc_tasks(created_at DESC);
CREATE INDEX idx_mc_tasks_assigned ON mc_tasks USING GIN(assigned_agent_ids);

-- ============================================
-- COMMENTS
-- ============================================
CREATE TABLE mc_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES mc_tasks(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES mc_agents(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mc_comments_task ON mc_comments(task_id);
CREATE INDEX idx_mc_comments_created ON mc_comments(created_at DESC);

-- ============================================
-- ACTIVITY FEED
-- ============================================
CREATE TABLE mc_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES mc_agents(id),
  type text NOT NULL, 
  -- Types: heartbeat | task_created | task_updated | task_assigned | 
  --        comment | status_change | blocked | unblocked
  message text NOT NULL,
  task_id uuid REFERENCES mc_tasks(id),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mc_activities_created ON mc_activities(created_at DESC);
CREATE INDEX idx_mc_activities_agent ON mc_activities(agent_id);
CREATE INDEX idx_mc_activities_type ON mc_activities(type);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update task updated_at on any change
CREATE OR REPLACE FUNCTION update_mc_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mc_task_timestamp
BEFORE UPDATE ON mc_tasks
FOR EACH ROW
EXECUTE FUNCTION update_mc_task_timestamp();

-- Auto-log activity on task status change
CREATE OR REPLACE FUNCTION log_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO mc_activities (
      agent_id,
      type,
      message,
      task_id,
      metadata
    )
    VALUES (
      (SELECT id FROM mc_agents WHERE current_task_id = NEW.id LIMIT 1),
      'status_change',
      'Task moved to ' || NEW.status,
      NEW.id,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_task_status_change
AFTER UPDATE ON mc_tasks
FOR EACH ROW
EXECUTE FUNCTION log_task_status_change();

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE mc_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mc_activities ENABLE ROW LEVEL SECURITY;

-- Jay can see everything
CREATE POLICY "Jay can view all MC data" ON mc_agents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM humans WHERE email = 'jay@solisinteractive.com' AND id::text = auth.uid()::text)
  );

CREATE POLICY "Jay can modify all MC data" ON mc_agents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM humans WHERE email = 'jay@solisinteractive.com' AND id::text = auth.uid()::text)
  );

CREATE POLICY "Jay can view all MC tasks" ON mc_tasks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM humans WHERE email = 'jay@solisinteractive.com' AND id::text = auth.uid()::text)
  );

CREATE POLICY "Jay can modify all MC tasks" ON mc_tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM humans WHERE email = 'jay@solisinteractive.com' AND id::text = auth.uid()::text)
  );

CREATE POLICY "Jay can view all MC comments" ON mc_comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM humans WHERE email = 'jay@solisinteractive.com' AND id::text = auth.uid()::text)
  );

CREATE POLICY "Jay can view all MC activities" ON mc_activities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM humans WHERE email = 'jay@solisinteractive.com' AND id::text = auth.uid()::text)
  );

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Clyde and Bonnie
INSERT INTO mc_agents (name, session_key, role, level, emoji, status) VALUES
  ('Clyde', 'agent:clyde:main', 'Strategic advisor & builder', 'lead', '🤠', 'idle'),
  ('Bonnie', 'agent:bonnie:main', 'Executive assistant', 'lead', '💼', 'idle')
ON CONFLICT (session_key) DO NOTHING;

-- Sample task
INSERT INTO mc_tasks (
  title, 
  description, 
  status, 
  created_by_agent_id,
  assigned_agent_ids
) VALUES (
  'Build Mission Control UI',
  'Create dashboard for tracking agent activity and task coordination',
  'in_progress',
  (SELECT id FROM mc_agents WHERE name = 'Clyde'),
  ARRAY[(SELECT id FROM mc_agents WHERE name = 'Clyde')]
);
