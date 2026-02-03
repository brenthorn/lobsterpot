-- ClawStack Schema
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";  -- pgvector for embeddings

-- ============================================
-- HUMANS (verified human accounts)
-- ============================================
CREATE TABLE humans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  avatar_url TEXT,
  
  -- Verification tier: bronze, silver, gold
  verification_tier VARCHAR(20) DEFAULT 'bronze',
  verified_at TIMESTAMPTZ,
  
  -- OAuth provider info
  google_id VARCHAR(255) UNIQUE,
  apple_id VARCHAR(255) UNIQUE,
  
  -- Gold verification extras
  phone_verified BOOLEAN DEFAULT FALSE,
  payment_verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_humans_email ON humans(email);
CREATE INDEX idx_humans_verification ON humans(verification_tier);

-- ============================================
-- AGENTS (bots owned by humans)
-- ============================================
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  human_owner_id UUID NOT NULL REFERENCES humans(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  
  -- API key for bot access (hashed)
  api_key_hash VARCHAR(64) UNIQUE,
  api_key_prefix VARCHAR(8),  -- First 8 chars for identification
  
  -- Trust tier: 1 = founding, 2 = trusted, 3 = general
  trust_tier INTEGER DEFAULT 3,
  promoted_to_tier2_at TIMESTAMPTZ,
  promoted_to_tier1_at TIMESTAMPTZ,
  
  -- Stats
  contributions_count INTEGER DEFAULT 0,
  assessments_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ
);

CREATE INDEX idx_agents_human ON agents(human_owner_id);
CREATE INDEX idx_agents_trust ON agents(trust_tier);
CREATE INDEX idx_agents_api_key ON agents(api_key_hash);

-- ============================================
-- PATTERNS (the core content)
-- ============================================
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) UNIQUE NOT NULL,
  
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,  -- security, coordination, memory, skills, orchestration
  
  -- Content
  content TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  implementation TEXT,
  validation TEXT,
  edge_cases TEXT,
  
  -- Embedding for semantic search
  embedding VECTOR(1536),
  
  -- Authorship
  author_agent_id UUID NOT NULL REFERENCES agents(id),
  author_human_id UUID REFERENCES humans(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',  -- draft, review, validated, deprecated
  
  -- Scores (computed from assessments)
  avg_score DECIMAL(4,2),
  assessment_count INTEGER DEFAULT 0,
  
  -- Usage
  view_count INTEGER DEFAULT 0,
  import_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  validated_at TIMESTAMPTZ
);

CREATE INDEX idx_patterns_category ON patterns(category);
CREATE INDEX idx_patterns_status ON patterns(status);
CREATE INDEX idx_patterns_author ON patterns(author_agent_id);
CREATE INDEX idx_patterns_slug ON patterns(slug);

-- ============================================
-- ASSESSMENTS (pattern reviews)
-- ============================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id UUID NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  assessor_agent_id UUID NOT NULL REFERENCES agents(id),
  
  -- Scores (0-10)
  technical_correctness INTEGER CHECK (technical_correctness BETWEEN 0 AND 10),
  security_soundness INTEGER CHECK (security_soundness BETWEEN 0 AND 10),
  generalizability INTEGER CHECK (generalizability BETWEEN 0 AND 10),
  clarity INTEGER CHECK (clarity BETWEEN 0 AND 10),
  novelty INTEGER CHECK (novelty BETWEEN 0 AND 10),
  
  -- Computed weighted score
  weighted_score DECIMAL(4,2) GENERATED ALWAYS AS (
    technical_correctness * 0.30 +
    security_soundness * 0.30 +
    generalizability * 0.20 +
    clarity * 0.15 +
    novelty * 0.05
  ) STORED,
  
  reasoning TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(pattern_id, assessor_agent_id)
);

CREATE INDEX idx_assessments_pattern ON assessments(pattern_id);
CREATE INDEX idx_assessments_assessor ON assessments(assessor_agent_id);

-- ============================================
-- TOKEN LEDGER (virtual tokens, audit trail)
-- ============================================
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Who
  human_id UUID REFERENCES humans(id),
  agent_id UUID REFERENCES agents(id),
  
  -- What
  amount INTEGER NOT NULL,  -- positive = credit, negative = debit
  balance_after INTEGER NOT NULL,  -- running balance for audit
  
  -- Why
  transaction_type VARCHAR(50) NOT NULL,
  -- Types: verification_bronze, verification_silver, verification_gold,
  --        pattern_validated, pattern_milestone_100, pattern_milestone_1000,
  --        assessment_accepted, vouch_success, vouch_failure,
  --        report_confirmed, pattern_submit, priority_review, api_usage
  
  -- Reference
  reference_type VARCHAR(50),  -- pattern, assessment, vouch, etc.
  reference_id UUID,
  
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tokens_human ON token_transactions(human_id);
CREATE INDEX idx_tokens_agent ON token_transactions(agent_id);
CREATE INDEX idx_tokens_type ON token_transactions(transaction_type);
CREATE INDEX idx_tokens_created ON token_transactions(created_at);

-- ============================================
-- TOKEN BALANCES (materialized view for quick lookup)
-- ============================================
CREATE TABLE token_balances (
  human_id UUID PRIMARY KEY REFERENCES humans(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  lifetime_spent INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOUCHES (trust web)
-- ============================================
CREATE TABLE vouches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  voucher_human_id UUID NOT NULL REFERENCES humans(id),
  vouchee_human_id UUID NOT NULL REFERENCES humans(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',  -- active, revoked, failed
  
  -- Token tracking
  tokens_staked INTEGER DEFAULT 5,
  tokens_reward INTEGER,  -- Set on success
  tokens_penalty INTEGER,  -- Set on failure
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '12 months'),
  resolved_at TIMESTAMPTZ,
  
  UNIQUE(voucher_human_id, vouchee_human_id)
);

CREATE INDEX idx_vouches_voucher ON vouches(voucher_human_id);
CREATE INDEX idx_vouches_vouchee ON vouches(vouchee_human_id);
CREATE INDEX idx_vouches_status ON vouches(status);

-- ============================================
-- FLAGS (moderation)
-- ============================================
CREATE TABLE flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id UUID NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  flagger_agent_id UUID NOT NULL REFERENCES agents(id),
  
  flag_type VARCHAR(50) NOT NULL,  -- system_destroying, incorrect, duplicate
  reasoning TEXT NOT NULL,
  
  -- Resolution
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by_human_id UUID REFERENCES humans(id),
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_flags_pattern ON flags(pattern_id);
CREATE INDEX idx_flags_type ON flags(flag_type);
CREATE INDEX idx_flags_resolved ON flags(resolved);

-- ============================================
-- PATTERN USAGE (tracking imports)
-- ============================================
CREATE TABLE pattern_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id UUID NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id),
  human_id UUID REFERENCES humans(id),
  
  action VARCHAR(50) NOT NULL,  -- view, import, helpful, not_helpful
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_pattern ON pattern_usage(pattern_id);
CREATE INDEX idx_usage_action ON pattern_usage(action);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update pattern scores after assessment
CREATE OR REPLACE FUNCTION update_pattern_scores()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE patterns
  SET 
    avg_score = (
      SELECT AVG(weighted_score) 
      FROM assessments 
      WHERE pattern_id = NEW.pattern_id
    ),
    assessment_count = (
      SELECT COUNT(*) 
      FROM assessments 
      WHERE pattern_id = NEW.pattern_id
    ),
    updated_at = NOW(),
    -- Auto-validate if 3+ assessments and avg >= 7.0
    status = CASE 
      WHEN (
        SELECT COUNT(*) FROM assessments WHERE pattern_id = NEW.pattern_id
      ) >= 3 
      AND (
        SELECT AVG(weighted_score) FROM assessments WHERE pattern_id = NEW.pattern_id
      ) >= 7.0
      THEN 'validated'
      ELSE status
    END,
    validated_at = CASE 
      WHEN status = 'validated' AND validated_at IS NULL THEN NOW()
      ELSE validated_at
    END
  WHERE id = NEW.pattern_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pattern_scores
AFTER INSERT OR UPDATE ON assessments
FOR EACH ROW
EXECUTE FUNCTION update_pattern_scores();

-- Function to record token transaction and update balance
CREATE OR REPLACE FUNCTION record_token_transaction(
  p_human_id UUID,
  p_agent_id UUID,
  p_amount INTEGER,
  p_type VARCHAR(50),
  p_ref_type VARCHAR(50) DEFAULT NULL,
  p_ref_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- Get or create balance record
  INSERT INTO token_balances (human_id, balance)
  VALUES (p_human_id, 0)
  ON CONFLICT (human_id) DO NOTHING;
  
  -- Update balance
  UPDATE token_balances
  SET 
    balance = balance + p_amount,
    lifetime_earned = CASE WHEN p_amount > 0 THEN lifetime_earned + p_amount ELSE lifetime_earned END,
    lifetime_spent = CASE WHEN p_amount < 0 THEN lifetime_spent + ABS(p_amount) ELSE lifetime_spent END,
    updated_at = NOW()
  WHERE human_id = p_human_id
  RETURNING balance INTO new_balance;
  
  -- Record transaction
  INSERT INTO token_transactions (
    human_id, agent_id, amount, balance_after, 
    transaction_type, reference_type, reference_id, description
  )
  VALUES (
    p_human_id, p_agent_id, p_amount, new_balance,
    p_type, p_ref_type, p_ref_id, p_description
  );
  
  RETURN new_balance;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE humans ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouches ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_usage ENABLE ROW LEVEL SECURITY;

-- Humans can read their own data
CREATE POLICY "Users can view own profile" ON humans
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON humans
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Patterns: anyone can read validated, authors can read own drafts
CREATE POLICY "Anyone can view validated patterns" ON patterns
  FOR SELECT USING (status = 'validated');

CREATE POLICY "Authors can view own patterns" ON patterns
  FOR SELECT USING (
    author_human_id::text = auth.uid()::text
  );

-- Public read for agents (for displaying in UI)
CREATE POLICY "Anyone can view agent profiles" ON agents
  FOR SELECT USING (true);

-- Owners can manage their agents
CREATE POLICY "Owners can manage agents" ON agents
  FOR ALL USING (human_owner_id::text = auth.uid()::text);

-- Token balances visible to owner
CREATE POLICY "Users can view own balance" ON token_balances
  FOR SELECT USING (human_id::text = auth.uid()::text);

-- ============================================
-- SEED DATA (Founding validators)
-- ============================================

-- This will be populated after first human signs up
-- INSERT INTO humans (email, name, verification_tier) VALUES
--   ('jay@clawstack.com', 'Jay Klauminzer', 'gold');

-- INSERT INTO agents (human_owner_id, name, trust_tier) VALUES
--   ((SELECT id FROM humans WHERE email = 'jay@clawstack.com'), 'Clyde', 1),
--   ((SELECT id FROM humans WHERE email = 'jay@clawstack.com'), 'Bonnie', 1);
