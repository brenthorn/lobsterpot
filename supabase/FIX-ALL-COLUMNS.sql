-- ============================================
-- COMPREHENSIVE SCHEMA FIX
-- Run this BEFORE running any migration files
-- Adds all potentially missing columns to existing tables
-- ============================================

-- Helper function to add column if not exists
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  _table TEXT, _column TEXT, _type TEXT, _default TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = _table AND column_name = _column
  ) THEN
    IF _default IS NOT NULL THEN
      EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s DEFAULT %s', _table, _column, _type, _default);
    ELSE
      EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', _table, _column, _type);
    END IF;
    RAISE NOTICE 'Added column %.%', _table, _column;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ACCOUNTS TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts') THEN
    PERFORM add_column_if_not_exists('accounts', 'auth_uid', 'UUID');
    PERFORM add_column_if_not_exists('accounts', 'name', 'VARCHAR(100)');
    PERFORM add_column_if_not_exists('accounts', 'avatar_url', 'TEXT');
    PERFORM add_column_if_not_exists('accounts', 'verification_tier', 'VARCHAR(20)', '''bronze''');
    PERFORM add_column_if_not_exists('accounts', 'verified_at', 'TIMESTAMPTZ');
    PERFORM add_column_if_not_exists('accounts', 'google_id', 'VARCHAR(255)');
    PERFORM add_column_if_not_exists('accounts', 'two_factor_enabled', 'BOOLEAN', 'FALSE');
    PERFORM add_column_if_not_exists('accounts', 'two_factor_secret', 'TEXT');
    PERFORM add_column_if_not_exists('accounts', 'tier', 'VARCHAR(20)', '''solo''');
    PERFORM add_column_if_not_exists('accounts', 'tier_expires_at', 'TIMESTAMPTZ');
    PERFORM add_column_if_not_exists('accounts', 'created_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('accounts', 'updated_at', 'TIMESTAMPTZ', 'NOW()');
  END IF;
END $$;

-- ============================================
-- BOTS TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bots') THEN
    PERFORM add_column_if_not_exists('bots', 'account_id', 'UUID');
    PERFORM add_column_if_not_exists('bots', 'name', 'VARCHAR(100)');
    PERFORM add_column_if_not_exists('bots', 'emoji', 'VARCHAR(10)', '''🤖''');
    PERFORM add_column_if_not_exists('bots', 'description', 'TEXT');
    PERFORM add_column_if_not_exists('bots', 'api_key_hash', 'VARCHAR(64)');
    PERFORM add_column_if_not_exists('bots', 'trust_tier', 'INTEGER', '3');
    PERFORM add_column_if_not_exists('bots', 'is_active', 'BOOLEAN', 'TRUE');
    PERFORM add_column_if_not_exists('bots', 'capabilities', 'TEXT[]', '''{}''');
    PERFORM add_column_if_not_exists('bots', 'model_config', 'JSONB');
    PERFORM add_column_if_not_exists('bots', 'system_prompt', 'TEXT');
    PERFORM add_column_if_not_exists('bots', 'created_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('bots', 'updated_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('bots', 'last_active_at', 'TIMESTAMPTZ');
  END IF;
END $$;

-- ============================================
-- MC_AGENTS TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mc_agents') THEN
    PERFORM add_column_if_not_exists('mc_agents', 'account_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_agents', 'name', 'TEXT');
    PERFORM add_column_if_not_exists('mc_agents', 'session_key', 'TEXT');
    PERFORM add_column_if_not_exists('mc_agents', 'role', 'TEXT');
    PERFORM add_column_if_not_exists('mc_agents', 'level', 'TEXT', '''specialist''');
    PERFORM add_column_if_not_exists('mc_agents', 'emoji', 'TEXT', '''🤖''');
    PERFORM add_column_if_not_exists('mc_agents', 'avatar_url', 'TEXT');
    PERFORM add_column_if_not_exists('mc_agents', 'status', 'TEXT', '''idle''');
    PERFORM add_column_if_not_exists('mc_agents', 'current_task_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_agents', 'last_heartbeat', 'TIMESTAMPTZ');
    PERFORM add_column_if_not_exists('mc_agents', 'created_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('mc_agents', 'updated_at', 'TIMESTAMPTZ', 'NOW()');
  END IF;
END $$;

-- ============================================
-- MC_TASKS TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mc_tasks') THEN
    PERFORM add_column_if_not_exists('mc_tasks', 'account_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_tasks', 'title', 'TEXT');
    PERFORM add_column_if_not_exists('mc_tasks', 'description', 'TEXT');
    PERFORM add_column_if_not_exists('mc_tasks', 'status', 'TEXT', '''inbox''');
    PERFORM add_column_if_not_exists('mc_tasks', 'assigned_agent_ids', 'UUID[]', '''{}''');
    PERFORM add_column_if_not_exists('mc_tasks', 'created_by_agent_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_tasks', 'tags', 'TEXT[]', '''{}''');
    PERFORM add_column_if_not_exists('mc_tasks', 'priority', 'TEXT', '''normal''');
    PERFORM add_column_if_not_exists('mc_tasks', 'created_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('mc_tasks', 'updated_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('mc_tasks', 'completed_at', 'TIMESTAMPTZ');
  END IF;
END $$;

-- ============================================
-- MC_COMMENTS TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mc_comments') THEN
    PERFORM add_column_if_not_exists('mc_comments', 'account_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_comments', 'task_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_comments', 'agent_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_comments', 'content', 'TEXT');
    PERFORM add_column_if_not_exists('mc_comments', 'mentions', 'JSONB', '''[]''');
    PERFORM add_column_if_not_exists('mc_comments', 'created_at', 'TIMESTAMPTZ', 'NOW()');
  END IF;
END $$;

-- ============================================
-- MC_ACTIVITIES TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mc_activities') THEN
    PERFORM add_column_if_not_exists('mc_activities', 'account_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_activities', 'agent_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_activities', 'type', 'TEXT');
    PERFORM add_column_if_not_exists('mc_activities', 'message', 'TEXT');
    PERFORM add_column_if_not_exists('mc_activities', 'task_id', 'UUID');
    PERFORM add_column_if_not_exists('mc_activities', 'metadata', 'JSONB');
    PERFORM add_column_if_not_exists('mc_activities', 'created_at', 'TIMESTAMPTZ', 'NOW()');
  END IF;
END $$;

-- ============================================
-- AGENT_TEMPLATES TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_templates') THEN
    PERFORM add_column_if_not_exists('agent_templates', 'name', 'VARCHAR(100)');
    PERFORM add_column_if_not_exists('agent_templates', 'emoji', 'VARCHAR(10)');
    PERFORM add_column_if_not_exists('agent_templates', 'description', 'TEXT');
    PERFORM add_column_if_not_exists('agent_templates', 'category', 'VARCHAR(50)', '''general''');
    PERFORM add_column_if_not_exists('agent_templates', 'tier', 'VARCHAR(20)', '''free''');
    PERFORM add_column_if_not_exists('agent_templates', 'model_tier', 'VARCHAR(20)', '''standard''');
    PERFORM add_column_if_not_exists('agent_templates', 'system_prompt', 'TEXT');
    PERFORM add_column_if_not_exists('agent_templates', 'capabilities', 'TEXT[]', '''{}''');
    PERFORM add_column_if_not_exists('agent_templates', 'suggested_tools', 'TEXT[]', '''{}''');
    PERFORM add_column_if_not_exists('agent_templates', 'avg_score', 'DECIMAL(3,2)', '0');
    PERFORM add_column_if_not_exists('agent_templates', 'import_count', 'INTEGER', '0');
    PERFORM add_column_if_not_exists('agent_templates', 'assessment_count', 'INTEGER', '0');
    PERFORM add_column_if_not_exists('agent_templates', 'author', 'VARCHAR(100)', '''Tiker Team''');
    PERFORM add_column_if_not_exists('agent_templates', 'featured', 'BOOLEAN', 'FALSE');
    PERFORM add_column_if_not_exists('agent_templates', 'created_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('agent_templates', 'updated_at', 'TIMESTAMPTZ', 'NOW()');
  END IF;
END $$;

-- ============================================
-- PATTERNS TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patterns') THEN
    PERFORM add_column_if_not_exists('patterns', 'slug', 'VARCHAR(200)');
    PERFORM add_column_if_not_exists('patterns', 'title', 'VARCHAR(200)');
    PERFORM add_column_if_not_exists('patterns', 'category', 'VARCHAR(50)');
    PERFORM add_column_if_not_exists('patterns', 'problem', 'TEXT');
    PERFORM add_column_if_not_exists('patterns', 'solution', 'TEXT');
    PERFORM add_column_if_not_exists('patterns', 'implementation', 'TEXT');
    PERFORM add_column_if_not_exists('patterns', 'validation', 'TEXT');
    PERFORM add_column_if_not_exists('patterns', 'edge_cases', 'TEXT');
    PERFORM add_column_if_not_exists('patterns', 'author_agent_id', 'UUID');
    PERFORM add_column_if_not_exists('patterns', 'author_account_id', 'UUID');
    PERFORM add_column_if_not_exists('patterns', 'status', 'VARCHAR(20)', '''draft''');
    PERFORM add_column_if_not_exists('patterns', 'avg_score', 'DECIMAL(4,2)', '0');
    PERFORM add_column_if_not_exists('patterns', 'assessment_count', 'INTEGER', '0');
    PERFORM add_column_if_not_exists('patterns', 'view_count', 'INTEGER', '0');
    PERFORM add_column_if_not_exists('patterns', 'import_count', 'INTEGER', '0');
    PERFORM add_column_if_not_exists('patterns', 'created_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('patterns', 'updated_at', 'TIMESTAMPTZ', 'NOW()');
    PERFORM add_column_if_not_exists('patterns', 'validated_at', 'TIMESTAMPTZ');
  END IF;
END $$;

-- ============================================
-- PATTERN_ASSESSMENTS TABLE
-- ============================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pattern_assessments') THEN
    PERFORM add_column_if_not_exists('pattern_assessments', 'pattern_id', 'UUID');
    PERFORM add_column_if_not_exists('pattern_assessments', 'assessor_account_id', 'UUID');
    PERFORM add_column_if_not_exists('pattern_assessments', 'assessor_bot_id', 'UUID');
    PERFORM add_column_if_not_exists('pattern_assessments', 'usefulness', 'INTEGER');
    PERFORM add_column_if_not_exists('pattern_assessments', 'clarity', 'INTEGER');
    PERFORM add_column_if_not_exists('pattern_assessments', 'accuracy', 'INTEGER');
    PERFORM add_column_if_not_exists('pattern_assessments', 'comment', 'TEXT');
    PERFORM add_column_if_not_exists('pattern_assessments', 'created_at', 'TIMESTAMPTZ', 'NOW()');
  END IF;
END $$;

-- ============================================
-- CLEANUP
-- ============================================
DROP FUNCTION IF EXISTS add_column_if_not_exists(TEXT, TEXT, TEXT, TEXT);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Schema fix complete. Run migrations now.' as status;

-- Show what tables exist and their column counts
SELECT table_name, COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('accounts', 'bots', 'mc_agents', 'mc_tasks', 'mc_comments', 'mc_activities', 'agent_templates', 'patterns', 'pattern_assessments')
GROUP BY table_name
ORDER BY table_name;
