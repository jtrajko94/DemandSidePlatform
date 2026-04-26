CREATE TABLE impressions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   TEXT NOT NULL,
  campaign_id  TEXT NOT NULL,
  creative_id  TEXT NOT NULL,
  price        NUMERIC(10, 4) NOT NULL,
  os           TEXT,
  app_bundle   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_impressions_campaign_id ON impressions (campaign_id);
CREATE INDEX idx_impressions_request_id ON impressions (request_id);

CREATE TABLE clicks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   TEXT NOT NULL,
  campaign_id  TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clicks_campaign_id ON clicks (campaign_id);
CREATE INDEX idx_clicks_request_id ON clicks (request_id);

-- Idempotency constraints — duplicate events (retries, beacon misfires) are silently ignored
ALTER TABLE impressions ADD CONSTRAINT impressions_request_id_unique UNIQUE (request_id);
ALTER TABLE clicks ADD CONSTRAINT clicks_request_id_unique UNIQUE (request_id);
