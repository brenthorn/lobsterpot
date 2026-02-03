-- ============================================
-- TIKER MIGRATION: Agent Templates + Task Claiming
-- Apply this to your Supabase database
-- 
-- Includes:
-- 1. Agent Templates (marketplace)
-- 2. Account Agent Templates (user installs)
-- 3. Account Model Config (tier mappings)
-- 4. Task Claiming (multi-gateway support)
-- ============================================

-- ============================================
-- 1. AGENT TEMPLATES (Curated Marketplace)
-- ============================================
CREATE TABLE IF NOT EXISTS agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  description TEXT,
  
  -- Configuration (injected at spawn time)
  soul TEXT NOT NULL,
  instructions TEXT,
  
  -- Model preference
  model_tier VARCHAR(20) DEFAULT 'standard',  -- fast | standard | reasoning
  
  -- Skills this agent uses
  skills TEXT[] DEFAULT '{}',
  
  -- Default behavior
  heartbeat_prompt TEXT,
  
  -- Access control
  tier_required VARCHAR(20) DEFAULT 'free',  -- free | basic | pro | team
  is_default BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  
  -- Categorization
  category VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  
  -- Stats
  install_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  
  -- Versioning
  version VARCHAR(20) DEFAULT '1.0.0',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_model_tier CHECK (model_tier IN ('fast', 'standard', 'reasoning')),
  CONSTRAINT valid_tier CHECK (tier_required IN ('free', 'basic', 'pro', 'team'))
);

CREATE INDEX IF NOT EXISTS idx_agent_templates_slug ON agent_templates(slug);
CREATE INDEX IF NOT EXISTS idx_agent_templates_category ON agent_templates(category);
CREATE INDEX IF NOT EXISTS idx_agent_templates_is_default ON agent_templates(is_default);
CREATE INDEX IF NOT EXISTS idx_agent_templates_is_published ON agent_templates(is_published);

-- ============================================
-- 2. ACCOUNT AGENT TEMPLATES (User Installs)
-- ============================================
CREATE TABLE IF NOT EXISTS account_agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  agent_template_id UUID NOT NULL REFERENCES agent_templates(id) ON DELETE CASCADE,
  
  -- Custom overrides (paid feature)
  custom_soul TEXT,
  custom_instructions TEXT,
  custom_model_tier VARCHAR(20),
  custom_skills TEXT[],
  
  -- Agent memory (persistent across spawns)
  memory JSONB DEFAULT '{}'::jsonb,
  
  -- Stats
  tasks_completed INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Status
  is_enabled BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(account_id, agent_template_id)
);

CREATE INDEX IF NOT EXISTS idx_account_agent_templates_account ON account_agent_templates(account_id);
CREATE INDEX IF NOT EXISTS idx_account_agent_templates_template ON account_agent_templates(agent_template_id);

-- ============================================
-- 3. ACCOUNT MODEL CONFIG
-- ============================================
CREATE TABLE IF NOT EXISTS account_model_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Model mappings
  model_default VARCHAR(100) NOT NULL,
  model_fast VARCHAR(100),
  model_reasoning VARCHAR(100),
  
  -- Provider preference
  primary_provider VARCHAR(50),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(account_id)
);

CREATE INDEX IF NOT EXISTS idx_account_model_config_account ON account_model_config(account_id);

-- ============================================
-- 4. TASK CLAIMING (Multi-Gateway)
-- ============================================
ALTER TABLE mc_tasks ADD COLUMN IF NOT EXISTS claimed_by_gateway VARCHAR(100);
ALTER TABLE mc_tasks ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_mc_tasks_claimed ON mc_tasks(claimed_by_gateway);

-- Atomic claim function
CREATE OR REPLACE FUNCTION claim_task(
  p_task_id UUID,
  p_gateway_id VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
  claimed_count INTEGER;
BEGIN
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

-- ============================================
-- 5. AUTO-ADD DEFAULTS FOR NEW ACCOUNTS
-- ============================================
CREATE OR REPLACE FUNCTION add_default_agent_templates()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO account_agent_templates (account_id, agent_template_id)
  SELECT NEW.id, id
  FROM agent_templates
  WHERE is_default = TRUE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_default_templates ON accounts;
CREATE TRIGGER trigger_add_default_templates
AFTER INSERT ON accounts
FOR EACH ROW
EXECUTE FUNCTION add_default_agent_templates();

-- ============================================
-- 6. GET AGENT CONFIG FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION get_agent_config(
  p_account_id UUID,
  p_template_slug VARCHAR(100)
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  template_row agent_templates%ROWTYPE;
  user_row account_agent_templates%ROWTYPE;
  model_row account_model_config%ROWTYPE;
  resolved_model VARCHAR(100);
BEGIN
  SELECT * INTO template_row
  FROM agent_templates
  WHERE slug = p_template_slug;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  SELECT * INTO user_row
  FROM account_agent_templates
  WHERE account_id = p_account_id AND agent_template_id = template_row.id;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  SELECT * INTO model_row
  FROM account_model_config
  WHERE account_id = p_account_id;
  
  -- Resolve model based on tier
  IF model_row IS NULL THEN
    resolved_model := 'anthropic/claude-sonnet-4-5';  -- Fallback default
  ELSE
    resolved_model := CASE COALESCE(user_row.custom_model_tier, template_row.model_tier)
      WHEN 'fast' THEN COALESCE(model_row.model_fast, model_row.model_default)
      WHEN 'reasoning' THEN COALESCE(model_row.model_reasoning, model_row.model_default)
      ELSE model_row.model_default
    END;
  END IF;
  
  result := jsonb_build_object(
    'slug', template_row.slug,
    'name', template_row.name,
    'emoji', template_row.emoji,
    'soul', COALESCE(user_row.custom_soul, template_row.soul),
    'instructions', COALESCE(user_row.custom_instructions, template_row.instructions),
    'skills', COALESCE(user_row.custom_skills, template_row.skills),
    'model', resolved_model,
    'model_tier', COALESCE(user_row.custom_model_tier, template_row.model_tier),
    'memory', user_row.memory
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_model_config ENABLE ROW LEVEL SECURITY;

-- Agent templates: public read
DROP POLICY IF EXISTS "Anyone can view published templates" ON agent_templates;
CREATE POLICY "Anyone can view published templates" ON agent_templates
  FOR SELECT USING (is_published = TRUE);

-- Account agent templates: users manage their own
DROP POLICY IF EXISTS "Users can view own agent templates" ON account_agent_templates;
CREATE POLICY "Users can view own agent templates" ON account_agent_templates
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own agent templates" ON account_agent_templates;
CREATE POLICY "Users can manage own agent templates" ON account_agent_templates
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- Model config: users manage their own
DROP POLICY IF EXISTS "Users can view own model config" ON account_model_config;
CREATE POLICY "Users can view own model config" ON account_model_config
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own model config" ON account_model_config;
CREATE POLICY "Users can manage own model config" ON account_model_config
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- ============================================
-- 8. SEED DEFAULT AGENT TEMPLATES
-- ============================================
INSERT INTO agent_templates (slug, name, emoji, description, soul, instructions, model_tier, skills, category, is_default, tier_required) VALUES

('assistant', 'Assistant', '🤖', 'General-purpose helpful assistant', 
'I am Assistant, your helpful AI companion.

## Core Traits
- Friendly, clear, and efficient
- I ask clarifying questions when needed
- I adapt my communication style to yours
- I''m honest about what I don''t know

## What I Do
- Answer questions and explain concepts
- Help organize thoughts and plans
- Draft messages and documents
- Research and summarize information',
'Focus on being genuinely helpful. Don''t over-explain unless asked. Match the user''s energy.',
'standard',
ARRAY['web_search', 'web_fetch', 'weather'],
'general',
TRUE,
'free'),

('coder', 'Coder', '💻', 'Software development specialist',
'I am Coder, a software development specialist.

## Core Traits
- Precise and detail-oriented
- I write clean, well-documented code
- I explain my reasoning and trade-offs

## What I Do
- Write and review code
- Debug and troubleshoot issues
- Design systems and architectures
- Set up development environments',
'Show the code first, explain after. Use clear variable names. Include error handling.',
'standard',
ARRAY['github', 'coding-agent', 'web_search'],
'development',
TRUE,
'free'),

('writer', 'Writer', '✍️', 'Content creation specialist',
'I am Writer, a content creation specialist.

## Core Traits
- Clear, engaging prose
- I adapt tone to audience and purpose
- I structure content for readability

## What I Do
- Draft emails, docs, and articles
- Edit and proofread content
- Create outlines and frameworks
- Summarize complex information',
'Structure first, then write. Use headers for long content. Cut unnecessary words.',
'standard',
ARRAY['summarize', 'web_fetch'],
'content',
TRUE,
'free'),

('researcher', 'Researcher', '🔬', 'Deep research and analysis specialist',
'I am Researcher, your analytical deep-diver.

## Core Traits
- Thorough and methodical
- I cite sources and show my work
- I identify gaps and uncertainties

## What I Do
- Deep dive into topics
- Compare and contrast options
- Analyze data and trends
- Create comprehensive reports',
'Always cite sources. Distinguish fact from inference. When uncertain, say so.',
'reasoning',
ARRAY['web_search', 'web_fetch', 'summarize'],
'research',
FALSE,
'basic'),

('marketing', 'Marketing', '📣', 'Marketing and growth specialist',
'I am Marketing, your growth specialist.

## Core Traits
- Creative and data-informed
- I understand audiences deeply
- I think in campaigns and funnels

## What I Do
- Create marketing copy and campaigns
- Analyze audience and positioning
- Draft social media content
- Plan launches and promotions',
'Know the audience before writing. Use hooks that create curiosity. Include clear CTAs.',
'standard',
ARRAY['web_search', 'web_fetch', 'summarize'],
'business',
FALSE,
'basic')

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  emoji = EXCLUDED.emoji,
  description = EXCLUDED.description,
  soul = EXCLUDED.soul,
  instructions = EXCLUDED.instructions,
  model_tier = EXCLUDED.model_tier,
  skills = EXCLUDED.skills,
  category = EXCLUDED.category,
  is_default = EXCLUDED.is_default,
  tier_required = EXCLUDED.tier_required,
  updated_at = NOW();

-- ============================================
-- DONE
-- ============================================
