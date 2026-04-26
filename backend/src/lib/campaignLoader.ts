import { Campaign } from "@dsp/shared";
import { db } from "./postgres";
import { redis } from "./redis";

const CAMPAIGN_KEY = "campaigns:active";
const REFRESH_INTERVAL_MS = 60_000; // re-sync from Postgres every 60s

export async function loadCampaignsIntoRedis(): Promise<void> {
  const result = await db.query<Campaign>(
    `SELECT * FROM campaigns WHERE status = 'active'`
  );

  const campaigns = result.rows;

  if (campaigns.length === 0) {
    console.warn("[campaignLoader] No active campaigns found");
    return;
  }

  // Store as a single JSON blob — simple and fast to read in the hot path
  await redis.set(CAMPAIGN_KEY, JSON.stringify(campaigns));

  console.log(`[campaignLoader] Loaded ${campaigns.length} campaigns into Redis`);
}

export async function getCampaignsFromRedis(): Promise<Campaign[]> {
  const data = await redis.get(CAMPAIGN_KEY);
  if (!data) return [];
  return JSON.parse(data) as Campaign[];
}

export function startCampaignRefresh(): void {
  setInterval(async () => {
    try {
      await loadCampaignsIntoRedis();
    } catch (err) {
      console.error("[campaignLoader] Refresh failed:", err);
    }
  }, REFRESH_INTERVAL_MS);
}
