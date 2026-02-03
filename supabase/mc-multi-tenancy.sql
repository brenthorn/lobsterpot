-- MC Multi-Tenancy Migration
-- Adds account_id to all MC tables so each user has their own workspace

-- ============================================
-- 1. ADD ACCOUNT_ID COLUMNS
-- ============================================

ALTER TABLE mc_agents ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE mc_tasks ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE mc_comments ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE mc_activities ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;

-- ============================================
-- 2. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_mc_agents_account ON mc_agents(account_id);
CREATE INDEX IF NOT EXISTS idx_mc_tasks_account ON mc_tasks(account_id);
CREATE INDEX IF NOT EXISTS idx_mc_comments_account ON mc_comments(account_id);
CREATE INDEX IF NOT EXISTS idx_mc_activities_account ON mc_activities(account_id);

-- ============================================
-- 3. MIGRATE EXISTING DATA TO JAY'S ACCOUNT
-- ============================================

-- Jay's account ID (jklauminzer@gmail.com)
UPDATE mc_agents SET account_id = '99741f28-95aa-4e33-b29c-5bf046a4ba55' WHERE account_id IS NULL;
UPDATE mc_tasks SET account_id = '99741f28-95aa-4e33-b29c-5bf046a4ba55' WHERE account_id IS NULL;
UPDATE mc_comments SET account_id = '99741f28-95aa-4e33-b29c-5bf046a4ba55' WHERE account_id IS NULL;
UPDATE mc_activities SET account_id = '99741f28-95aa-4e33-b29c-5bf046a4ba55' WHERE account_id IS NULL;

-- ============================================
-- 4. DROP OLD RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Jay can view all MC data" ON mc_agents;
DROP POLICY IF EXISTS "Jay can modify all MC data" ON mc_agents;
DROP POLICY IF EXISTS "Jay can view all MC tasks" ON mc_tasks;
DROP POLICY IF EXISTS "Jay can modify all MC tasks" ON mc_tasks;
DROP POLICY IF EXISTS "Jay can view all MC comments" ON mc_comments;
DROP POLICY IF EXISTS "Jay can view all MC activities" ON mc_activities;

-- ============================================
-- 5. NEW RLS POLICIES (Account-based)
-- ============================================

-- mc_agents: Users see/manage their own agents
CREATE POLICY "Users manage own MC agents" ON mc_agents
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE auth_uid = auth.uid())
  );

-- mc_tasks: Users see/manage their own tasks
CREATE POLICY "Users manage own MC tasks" ON mc_tasks
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE auth_uid = auth.uid())
  );

-- mc_comments: Users see/manage comments on their tasks
CREATE POLICY "Users manage own MC comments" ON mc_comments
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE auth_uid = auth.uid())
  );

-- mc_activities: Users see their own activities
CREATE POLICY "Users view own MC activities" ON mc_activities
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE auth_uid = auth.uid())
  );

-- ============================================
-- 6. HELPER FUNCTION: Get current account ID
-- ============================================

CREATE OR REPLACE FUNCTION get_current_account_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM accounts WHERE auth_uid = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. UPDATE mc_admin → Everyone with account gets MC
-- ============================================

-- mc_admin is no longer needed - everyone gets MC
-- But we keep the column for now, just ignore it in code

COMMENT ON COLUMN accounts.mc_admin IS 'DEPRECATED - all users now have MC access';

-- ============================================
-- DONE
-- ============================================
