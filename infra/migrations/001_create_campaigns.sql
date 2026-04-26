CREATE TABLE campaigns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),

  -- Financials
  bid_price   NUMERIC(10, 4) NOT NULL,  -- CPM in USD
  daily_budget NUMERIC(10, 4) NOT NULL,
  total_budget NUMERIC(10, 4) NOT NULL,
  spend       NUMERIC(10, 4) NOT NULL DEFAULT 0,

  -- Targeting (nullable = no restriction on that dimension)
  target_os           TEXT[],    -- e.g. ARRAY['iOS', 'Android'] or NULL for all
  target_iab_cats     TEXT[],    -- e.g. ARRAY['IAB1', 'IAB7'] or NULL for all
  target_banner_sizes JSONB,     -- e.g. [{"w": 320, "h": 50}] or NULL for all

  -- Creative
  creative_id TEXT NOT NULL,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only active campaigns need to be fetched frequently
CREATE INDEX idx_campaigns_status ON campaigns (status);

-- Seed some test campaigns
INSERT INTO campaigns (name, status, bid_price, daily_budget, total_budget, target_os, target_iab_cats, target_banner_sizes, creative_id)
VALUES
  (
    'iOS News Campaign',
    'active',
    1.50,
    100.00,
    1000.00,
    ARRAY['iOS'],
    ARRAY['IAB1'],
    '[{"w": 320, "h": 50}]',
    'creative-001'
  ),
  (
    'Android Gaming Campaign',
    'active',
    2.00,
    200.00,
    2000.00,
    ARRAY['Android'],
    ARRAY['IAB9'],
    '[{"w": 300, "h": 250}]',
    'creative-002'
  ),
  (
    'All Devices Sports',
    'active',
    1.20,
    150.00,
    1500.00,
    NULL,
    ARRAY['IAB17'],
    NULL,
    'creative-003'
  );
