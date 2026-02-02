-- Mission Control Billing Schema
-- Extension to existing schema for SaaS billing, accounts, and bot management

-- ============================================
-- ACCOUNTS (billing/subscription management)
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Link to auth user
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  
  -- Subscription tier
  tier VARCHAR(20) DEFAULT 'free',  -- free, basic, pro, team
  tier_updated_at TIMESTAMPTZ,
  
  -- Stripe integration
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  subscription_status VARCHAR(50),  -- active, canceled, past_due, trialing
  subscription_current_period_end TIMESTAMPTZ,
  
  -- OAuth provider info (for signup tracking)
  google_id VARCHAR(255) UNIQUE,
  
  -- API access
  api_key_hash VARCHAR(64) UNIQUE,
  api_key_prefix VARCHAR(8),  -- First 8 chars for identification
  api_key_created_at TIMESTAMPTZ,
  
  -- 2FA
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  two_factor_backup_codes JSONB,  -- Array of backup codes
  
  -- Limits (based on tier)
  max_bots INTEGER DEFAULT 1,
  max_tasks INTEGER DEFAULT 50,
  can_invite_guests BOOLEAN DEFAULT FALSE,
  
  -- Usage tracking
  current_bot_count INTEGER DEFAULT 0,
  current_task_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_stripe_customer ON accounts(stripe_customer_id);
CREATE INDEX idx_accounts_tier ON accounts(tier);

-- ============================================
-- BOTS (agent instances for Mission Control)
-- ============================================
CREATE TABLE IF NOT EXISTS bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  
  -- Access control
  token_hash VARCHAR(64) UNIQUE NOT NULL,
  token_prefix VARCHAR(8) NOT NULL,  -- First 8 chars for identification
  whitelisted BOOLEAN DEFAULT TRUE,
  
  -- Configuration
  skills_enabled JSONB DEFAULT '[]'::jsonb,  -- Array of enabled skill slugs
  config JSONB DEFAULT '{}'::jsonb,  -- Custom bot config
  
  -- Status
  status VARCHAR(20) DEFAULT 'idle',  -- idle, active, blocked, offline
  last_heartbeat_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  
  -- Stats
  tasks_completed INTEGER DEFAULT 0,
  uptime_hours INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bots_account ON bots(account_id);
CREATE INDEX idx_bots_token_hash ON bots(token_hash);
CREATE INDEX idx_bots_status ON bots(status);

-- ============================================
-- SKILL TEMPLATES (available skills per tier)
-- ============================================
CREATE TABLE IF NOT EXISTS skill_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),  -- coordination, memory, security, integrations
  
  -- Configuration
  config JSONB DEFAULT '{}'::jsonb,
  default_enabled BOOLEAN DEFAULT FALSE,
  
  -- Access control
  tier_required VARCHAR(20) DEFAULT 'free',  -- free, basic, pro, team
  requires_api_keys JSONB DEFAULT '[]'::jsonb,  -- Array of required API key names
  
  -- Documentation
  readme TEXT,
  examples JSONB,
  
  -- Metadata
  version VARCHAR(20),
  author VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_tier CHECK (tier_required IN ('free', 'basic', 'pro', 'team'))
);

CREATE INDEX idx_skill_templates_slug ON skill_templates(slug);
CREATE INDEX idx_skill_templates_tier ON skill_templates(tier_required);
CREATE INDEX idx_skill_templates_category ON skill_templates(category);

-- ============================================
-- SERVICE PURCHASES (one-time services)
-- ============================================
CREATE TABLE IF NOT EXISTS service_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Product
  sku VARCHAR(100) NOT NULL,  -- vps-setup, pi-package, mac-package, consulting-hour
  name VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Pricing
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Stripe
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  payment_status VARCHAR(50),  -- pending, succeeded, failed, refunded
  
  -- Service delivery
  delivery_status VARCHAR(50) DEFAULT 'pending',  -- pending, in_progress, completed, canceled
  delivery_notes TEXT,
  completed_at TIMESTAMPTZ,
  
  -- Expiry (for recurring services like monitoring)
  expiry_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_service_purchases_account ON service_purchases(account_id);
CREATE INDEX idx_service_purchases_sku ON service_purchases(sku);
CREATE INDEX idx_service_purchases_stripe_pi ON service_purchases(stripe_payment_intent_id);
CREATE INDEX idx_service_purchases_status ON service_purchases(payment_status, delivery_status);

-- ============================================
-- USAGE METRICS (for analytics & billing)
-- ============================================
CREATE TABLE IF NOT EXISTS usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  bot_id UUID REFERENCES bots(id) ON DELETE SET NULL,
  
  -- Metric type
  metric_type VARCHAR(50) NOT NULL,  -- task_created, task_completed, api_call, heartbeat
  
  -- Value
  value INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp (for time-series analysis)
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Billing period tracking
  billing_period VARCHAR(20)  -- YYYY-MM format
);

CREATE INDEX idx_usage_metrics_account ON usage_metrics(account_id);
CREATE INDEX idx_usage_metrics_bot ON usage_metrics(bot_id);
CREATE INDEX idx_usage_metrics_type ON usage_metrics(metric_type);
CREATE INDEX idx_usage_metrics_recorded ON usage_metrics(recorded_at);
CREATE INDEX idx_usage_metrics_billing_period ON usage_metrics(billing_period);

-- ============================================
-- GUEST INVITES (pro/team feature)
-- ============================================
CREATE TABLE IF NOT EXISTS guest_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  email VARCHAR(255) NOT NULL,
  token VARCHAR(64) UNIQUE NOT NULL,
  
  -- Access level
  access_level VARCHAR(20) DEFAULT 'read-only',  -- read-only, comment, write
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',  -- pending, accepted, expired, revoked
  accepted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  
  -- Expiry
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_guest_invites_account ON guest_invites(account_id);
CREATE INDEX idx_guest_invites_email ON guest_invites(email);
CREATE INDEX idx_guest_invites_token ON guest_invites(token);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update bot count when bot is created/deleted
CREATE OR REPLACE FUNCTION update_account_bot_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE accounts
    SET current_bot_count = (
      SELECT COUNT(*) FROM bots WHERE account_id = NEW.account_id
    )
    WHERE id = NEW.account_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE accounts
    SET current_bot_count = (
      SELECT COUNT(*) FROM bots WHERE account_id = OLD.account_id
    )
    WHERE id = OLD.account_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bot_count
AFTER INSERT OR DELETE ON bots
FOR EACH ROW
EXECUTE FUNCTION update_account_bot_count();

-- Function to record usage metric
CREATE OR REPLACE FUNCTION record_usage_metric(
  p_account_id UUID,
  p_bot_id UUID,
  p_metric_type VARCHAR(50),
  p_value INTEGER DEFAULT 1,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  new_metric_id UUID;
  current_period VARCHAR(20);
BEGIN
  -- Get current billing period (YYYY-MM)
  current_period := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Insert metric
  INSERT INTO usage_metrics (
    account_id, bot_id, metric_type, value, metadata, billing_period
  )
  VALUES (
    p_account_id, p_bot_id, p_metric_type, p_value, p_metadata, current_period
  )
  RETURNING id INTO new_metric_id;
  
  RETURN new_metric_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if account can create more bots
CREATE OR REPLACE FUNCTION can_create_bot(p_account_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_count INTEGER;
BEGIN
  SELECT current_bot_count, max_bots
  INTO current_count, max_count
  FROM accounts
  WHERE id = p_account_id;
  
  RETURN current_count < max_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_invites ENABLE ROW LEVEL SECURITY;

-- Accounts: users can view/update their own
CREATE POLICY "Users can view own account" ON accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own account" ON accounts
  FOR UPDATE USING (user_id = auth.uid());

-- Bots: users can manage bots for their account
CREATE POLICY "Users can view own bots" ON bots
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own bots" ON bots
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- Skill templates: public read
CREATE POLICY "Anyone can view skill templates" ON skill_templates
  FOR SELECT USING (true);

-- Service purchases: users can view their own
CREATE POLICY "Users can view own purchases" ON service_purchases
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- Usage metrics: users can view their own
CREATE POLICY "Users can view own metrics" ON usage_metrics
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- Guest invites: account owners can manage
CREATE POLICY "Account owners can manage invites" ON guest_invites
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

-- ============================================
-- SEED DATA (Tier limits)
-- ============================================

-- This will be inserted via migration or admin panel
-- Free tier: 1 bot, 50 tasks, no guests
-- Basic tier: 3 bots, 200 tasks, no guests
-- Pro tier: unlimited bots, unlimited tasks, 5 guests
-- Team tier: unlimited bots, unlimited tasks, unlimited guests

COMMENT ON TABLE accounts IS 'User accounts with billing/subscription info';
COMMENT ON TABLE bots IS 'Agent instances for Mission Control';
COMMENT ON TABLE skill_templates IS 'Available skills catalog';
COMMENT ON TABLE service_purchases IS 'One-time service purchases (setup, consulting)';
COMMENT ON TABLE usage_metrics IS 'Usage tracking for analytics and billing';
COMMENT ON TABLE guest_invites IS 'Guest access invitations (pro/team feature)';
