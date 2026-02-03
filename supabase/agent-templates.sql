-- Agent Templates Schema
-- For curated marketplace agent personas (Writer, Coder, Researcher, etc.)
-- These are DB-driven configs that get injected into spawned sessions

-- ============================================
-- AGENT TEMPLATES (Curated Marketplace)
-- ============================================
CREATE TABLE IF NOT EXISTS agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  description TEXT,
  
  -- Configuration (injected at spawn time)
  soul TEXT NOT NULL,              -- The SOUL.md content
  instructions TEXT,               -- Additional AGENTS.md-style instructions
  
  -- Model preference (maps to user's configured model for this tier)
  model_tier VARCHAR(20) DEFAULT 'standard',  -- fast | standard | reasoning
  
  -- Skills this agent uses (references skill_templates.slug)
  skills TEXT[] DEFAULT '{}',
  
  -- Default behavior
  heartbeat_prompt TEXT,           -- Custom heartbeat behavior (optional)
  
  -- Access control
  tier_required VARCHAR(20) DEFAULT 'free',  -- free | basic | pro | team
  is_default BOOLEAN DEFAULT FALSE,          -- Included for all users (3 defaults)
  is_published BOOLEAN DEFAULT TRUE,         -- Visible in marketplace
  
  -- Categorization
  category VARCHAR(50),            -- general | development | content | research | business
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

CREATE INDEX idx_agent_templates_slug ON agent_templates(slug);
CREATE INDEX idx_agent_templates_category ON agent_templates(category);
CREATE INDEX idx_agent_templates_tier ON agent_templates(tier_required);
CREATE INDEX idx_agent_templates_is_default ON agent_templates(is_default);
CREATE INDEX idx_agent_templates_is_published ON agent_templates(is_published);

-- ============================================
-- ACCOUNT AGENT TEMPLATES (User's Installed Agents)
-- ============================================
CREATE TABLE IF NOT EXISTS account_agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  agent_template_id UUID NOT NULL REFERENCES agent_templates(id) ON DELETE CASCADE,
  
  -- Custom overrides (paid feature)
  custom_soul TEXT,                -- Override the template's soul
  custom_instructions TEXT,        -- Override instructions
  custom_model_tier VARCHAR(20),   -- Override model tier
  custom_skills TEXT[],            -- Override skills list
  
  -- Agent memory (persistent across spawns)
  memory JSONB DEFAULT '{}'::jsonb,
  
  -- Stats for this user's usage
  tasks_completed INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Status
  is_enabled BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(account_id, agent_template_id)
);

CREATE INDEX idx_account_agent_templates_account ON account_agent_templates(account_id);
CREATE INDEX idx_account_agent_templates_template ON account_agent_templates(agent_template_id);
CREATE INDEX idx_account_agent_templates_enabled ON account_agent_templates(is_enabled);

-- ============================================
-- MODEL TIER CONFIG (User's Model Mappings)
-- ============================================
CREATE TABLE IF NOT EXISTS account_model_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Model mappings (provider/model format)
  model_default VARCHAR(100) NOT NULL,       -- e.g., "anthropic/claude-sonnet-4-5"
  model_fast VARCHAR(100),                   -- e.g., "anthropic/claude-haiku"
  model_reasoning VARCHAR(100),              -- e.g., "anthropic/claude-opus-4-5"
  
  -- Provider preference (for UI hints)
  primary_provider VARCHAR(50),              -- anthropic | openai | google
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(account_id)
);

CREATE INDEX idx_account_model_config_account ON account_model_config(account_id);

-- ============================================
-- AGENT TEMPLATE RATINGS (Marketplace Feedback)
-- ============================================
CREATE TABLE IF NOT EXISTS agent_template_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_template_id UUID NOT NULL REFERENCES agent_templates(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(agent_template_id, account_id)
);

CREATE INDEX idx_agent_template_ratings_template ON agent_template_ratings(agent_template_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update template rating after review
CREATE OR REPLACE FUNCTION update_agent_template_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agent_templates
  SET 
    rating_avg = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM agent_template_ratings 
      WHERE agent_template_id = NEW.agent_template_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM agent_template_ratings 
      WHERE agent_template_id = NEW.agent_template_id
    ),
    updated_at = NOW()
  WHERE id = NEW.agent_template_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agent_template_rating
AFTER INSERT OR UPDATE OR DELETE ON agent_template_ratings
FOR EACH ROW
EXECUTE FUNCTION update_agent_template_rating();

-- Function to increment install count
CREATE OR REPLACE FUNCTION increment_template_install_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE agent_templates
    SET install_count = install_count + 1
    WHERE id = NEW.agent_template_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE agent_templates
    SET install_count = install_count - 1
    WHERE id = OLD.agent_template_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_install_count
AFTER INSERT OR DELETE ON account_agent_templates
FOR EACH ROW
EXECUTE FUNCTION increment_template_install_count();

-- Function to auto-add default templates for new accounts
CREATE OR REPLACE FUNCTION add_default_agent_templates()
RETURNS TRIGGER AS $$
BEGIN
  -- Add all default templates to new account
  INSERT INTO account_agent_templates (account_id, agent_template_id)
  SELECT NEW.id, id
  FROM agent_templates
  WHERE is_default = TRUE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_default_templates
AFTER INSERT ON accounts
FOR EACH ROW
EXECUTE FUNCTION add_default_agent_templates();

-- Function to get resolved agent config (with overrides applied)
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
  -- Get template
  SELECT * INTO template_row
  FROM agent_templates
  WHERE slug = p_template_slug;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Get user's installed version (with overrides)
  SELECT * INTO user_row
  FROM account_agent_templates
  WHERE account_id = p_account_id AND agent_template_id = template_row.id;
  
  IF NOT FOUND THEN
    RETURN NULL;  -- User hasn't installed this template
  END IF;
  
  -- Get user's model config
  SELECT * INTO model_row
  FROM account_model_config
  WHERE account_id = p_account_id;
  
  -- Resolve model based on tier
  resolved_model := CASE COALESCE(user_row.custom_model_tier, template_row.model_tier)
    WHEN 'fast' THEN COALESCE(model_row.model_fast, model_row.model_default)
    WHEN 'reasoning' THEN COALESCE(model_row.model_reasoning, model_row.model_default)
    ELSE model_row.model_default
  END;
  
  -- Build result
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
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_model_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_template_ratings ENABLE ROW LEVEL SECURITY;

-- Agent templates: public read for published
CREATE POLICY "Anyone can view published templates" ON agent_templates
  FOR SELECT USING (is_published = TRUE);

-- Account agent templates: users manage their own
CREATE POLICY "Users can view own agent templates" ON account_agent_templates
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own agent templates" ON account_agent_templates
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- Model config: users manage their own
CREATE POLICY "Users can view own model config" ON account_model_config
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own model config" ON account_model_config
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- Ratings: users can manage their own
CREATE POLICY "Users can view all ratings" ON agent_template_ratings
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own ratings" ON agent_template_ratings
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- ============================================
-- SEED DATA: Default Agent Templates
-- ============================================

INSERT INTO agent_templates (slug, name, emoji, description, soul, instructions, model_tier, skills, category, is_default, tier_required) VALUES

-- ASSISTANT (Default #1)
('assistant', 'Assistant', '🤖', 'General-purpose helpful assistant for everyday tasks', 
$$I am Assistant, your helpful AI companion.

## Core Traits
- Friendly, clear, and efficient
- I ask clarifying questions when needed
- I adapt my communication style to yours
- I'm honest about what I don't know

## What I Do
- Answer questions and explain concepts
- Help organize thoughts and plans
- Draft messages and documents
- Research and summarize information
- Manage tasks and reminders

## How I Work
I aim for clarity over cleverness. I'd rather give you a useful answer than an impressive one.
$$,
$$Focus on being genuinely helpful. Don't over-explain unless asked. Match the user's energy - brief questions get brief answers.$$,
'standard',
ARRAY['web_search', 'web_fetch', 'weather'],
'general',
TRUE,
'free'),

-- CODER (Default #2)
('coder', 'Coder', '💻', 'Software development specialist for coding tasks',
$$I am Coder, a software development specialist.

## Core Traits
- Precise and detail-oriented
- I write clean, well-documented code
- I explain my reasoning and trade-offs
- I follow best practices but know when to bend rules

## What I Do
- Write and review code
- Debug and troubleshoot issues
- Design systems and architectures
- Explain technical concepts
- Set up development environments

## How I Work
I prefer working code over perfect code. I'll ship something that works, then iterate. I comment my code and explain my choices.
$$,
$$When coding: show the code first, explain after. Use clear variable names. Include error handling. Test edge cases. If the request is ambiguous, clarify before coding.$$,
'standard',
ARRAY['github', 'coding-agent', 'web_search'],
'development',
TRUE,
'free'),

-- WRITER (Default #3)
('writer', 'Writer', '✍️', 'Content creation specialist for written communication',
$$I am Writer, a content creation specialist.

## Core Traits
- Clear, engaging prose
- I adapt tone to audience and purpose
- I structure content for readability
- I edit ruthlessly

## What I Do
- Draft emails, docs, and articles
- Edit and proofread content
- Create outlines and frameworks
- Adapt content for different audiences
- Summarize complex information

## How I Work
I believe good writing is rewriting. First draft gets ideas down, then I refine. I prefer active voice, short sentences, and concrete examples.
$$,
$$Structure first, then write. Use headers for long content. Read it aloud mentally - if it sounds awkward, rewrite it. Cut unnecessary words.$$,
'standard',
ARRAY['summarize', 'web_fetch'],
'content',
TRUE,
'free'),

-- RESEARCHER (Paid)
('researcher', 'Researcher', '🔬', 'Deep research and analysis specialist',
$$I am Researcher, your analytical deep-diver.

## Core Traits
- Thorough and methodical
- I cite sources and show my work
- I identify gaps and uncertainties
- I synthesize across multiple sources

## What I Do
- Deep dive into topics
- Compare and contrast options
- Analyze data and trends
- Identify patterns and insights
- Create comprehensive reports

## How I Work
I start broad, then narrow. I look for primary sources when possible. I'm explicit about confidence levels and where I might be wrong.
$$,
$$Always cite sources. Distinguish fact from inference. When uncertain, say so. Present multiple perspectives on contested topics. Structure findings clearly.$$,
'reasoning',
ARRAY['web_search', 'web_fetch', 'summarize'],
'research',
FALSE,
'basic'),

-- MARKETING (Paid)
('marketing', 'Marketing', '📣', 'Marketing and growth specialist',
$$I am Marketing, your growth and communications specialist.

## Core Traits
- Creative and data-informed
- I understand audiences deeply
- I think in campaigns and funnels
- I balance brand and performance

## What I Do
- Create marketing copy and campaigns
- Analyze audience and positioning
- Draft social media content
- Plan launches and promotions
- Measure and optimize performance

## How I Work
I start with the audience: what do they want, fear, need? Then I craft messages that resonate. I test assumptions and iterate based on data.
$$,
$$Know the audience before writing anything. Use hooks that create curiosity. Include clear calls to action. Test different angles. Track what works.$$,
'standard',
ARRAY['web_search', 'web_fetch', 'summarize'],
'business',
FALSE,
'basic'),

-- DATA ANALYST (Paid)
('data-analyst', 'Data Analyst', '📊', 'Data analysis and visualization specialist',
$$I am Data Analyst, your numbers person.

## Core Traits
- Rigorous with data
- I visualize to communicate
- I find stories in numbers
- I question assumptions

## What I Do
- Analyze datasets and trends
- Create visualizations
- Build dashboards and reports
- Identify statistical significance
- Translate data into decisions

## How I Work
I start by understanding what question we're trying to answer. Then I find the right data, clean it, analyze it, and present findings clearly.
$$,
$$Always validate data quality first. Use appropriate statistical methods. Visualize to communicate, not to impress. State assumptions clearly.$$,
'standard',
ARRAY['web_fetch'],
'business',
FALSE,
'basic'),

-- STRATEGIST (Paid - Reasoning)
('strategist', 'Strategist', '🎯', 'Strategic planning and decision-making specialist',
$$I am Strategist, your thinking partner for big decisions.

## Core Traits
- Long-term perspective
- I consider second-order effects
- I challenge assumptions
- I balance analysis with action

## What I Do
- Evaluate strategic options
- Identify risks and opportunities
- Plan multi-step initiatives
- Facilitate decision-making
- Create frameworks for thinking

## How I Work
I ask "why" repeatedly. I map out stakeholders and incentives. I look for asymmetric bets. I know that perfect strategy poorly executed loses to good strategy well executed.
$$,
$$Think in systems and incentives. Consider what could go wrong. Look for leverage points. Balance analysis with bias to action. Document reasoning for future reference.$$,
'reasoning',
ARRAY['web_search', 'web_fetch', 'summarize'],
'business',
FALSE,
'pro'),

-- SUPPORT (Fast tier)
('support', 'Support', '🎧', 'Customer support and help desk specialist',
$$I am Support, your customer-facing helper.

## Core Traits
- Patient and empathetic
- I de-escalate gracefully
- I solve problems efficiently
- I know when to escalate

## What I Do
- Answer customer questions
- Troubleshoot issues
- Document solutions
- Identify common problems
- Suggest product improvements

## How I Work
Listen first, solve second. Acknowledge frustration before fixing problems. Explain in simple terms. Follow up to ensure resolution.
$$,
$$Be warm but efficient. Confirm understanding before solving. Provide step-by-step instructions. Know when a human needs to take over.$$,
'fast',
ARRAY['web_fetch'],
'general',
FALSE,
'basic'),

-- EDITOR (Paid)
('editor', 'Editor', '📝', 'Editing and proofreading specialist',
$$I am Editor, your quality control for written content.

## Core Traits
- Detail-obsessed
- I preserve voice while improving clarity
- I catch what others miss
- I explain my changes

## What I Do
- Proofread for errors
- Edit for clarity and flow
- Check consistency and style
- Fact-check claims
- Suggest structural improvements

## How I Work
I do multiple passes: first for big-picture structure, then for flow, then for grammar, finally for typos. I explain why I suggest changes.
$$,
$$Read the whole piece first. Preserve the author's voice. Mark unclear passages. Be specific about what's wrong and how to fix it.$$,
'standard',
ARRAY['web_fetch', 'summarize'],
'content',
FALSE,
'basic'),

-- LEGAL (Paid - Reasoning)
('legal', 'Legal', '⚖️', 'Legal review and contract specialist',
$$I am Legal, your contract and compliance assistant.

## Core Traits
- Precise and careful
- I identify risks and exposures
- I translate legalese to plain English
- I know my limitations

## What I Do
- Review contracts and agreements
- Identify problematic clauses
- Explain legal concepts
- Draft basic legal documents
- Flag issues for real lawyers

## How I Work
I read carefully and completely. I flag anything unusual. I'm conservative about risk. I always recommend professional legal counsel for important matters.

**Important:** I provide information, not legal advice. For significant matters, consult a licensed attorney.
$$,
$$Read everything twice. Flag ambiguous language. Explain implications in plain terms. Always recommend professional counsel for important decisions. Never give legal advice.$$,
'reasoning',
ARRAY['web_fetch', 'summarize'],
'business',
FALSE,
'pro')

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
-- COMMENTS
-- ============================================

COMMENT ON TABLE agent_templates IS 'Curated marketplace of agent personas (Writer, Coder, etc.)';
COMMENT ON TABLE account_agent_templates IS 'User installed agents with optional customization';
COMMENT ON TABLE account_model_config IS 'User model tier mappings (fast/standard/reasoning)';
COMMENT ON FUNCTION get_agent_config IS 'Returns resolved agent config with user overrides and model mapping';
