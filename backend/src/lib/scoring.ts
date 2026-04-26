import { Campaign, BidRequest } from "@dsp/shared";

// Hardcoded pCTR signal weights — in production these come from a trained model
const OS_MULTIPLIER: Record<string, number> = {
  iOS: 1.2,      // iOS users historically higher CTR
  Android: 1.0,
};

const IAB_MULTIPLIER: Record<string, number> = {
  IAB9: 1.3,   // gaming — high engagement
  IAB1: 1.1,   // arts & entertainment
  IAB17: 1.0,  // sports — baseline
  IAB7: 0.9,   // health — lower CTR for banner ads
};

const SIZE_MULTIPLIER: Record<string, number> = {
  "300x250": 1.25,  // medium rectangle — best performing banner size
  "320x50":  1.0,   // mobile banner — baseline
  "728x90":  0.85,  // leaderboard — lower CTR on mobile
};

function getSizeKey(w?: number, h?: number): string | null {
  if (!w || !h) return null;
  return `${w}x${h}`;
}

export interface ScoredCampaign {
  campaign: Campaign;
  predictedCpm: number;
  pCtr: number;
}

export function scoreCampaign(campaign: Campaign, bidRequest: BidRequest): ScoredCampaign {
  const { device, app, imp } = bidRequest;
  const impression = imp[0];

  // Start from base pCTR of 1%
  let pCtr = 0.01;

  // Apply OS signal
  const osMultiplier = device?.os ? (OS_MULTIPLIER[device.os] ?? 1.0) : 1.0;
  pCtr *= osMultiplier;

  // Apply IAB category signal — use the best matching category
  if (app?.cat && app.cat.length > 0) {
    const bestCatMultiplier = Math.max(
      ...app.cat.map((cat) => IAB_MULTIPLIER[cat] ?? 1.0)
    );
    pCtr *= bestCatMultiplier;
  }

  // Apply banner size signal
  const sizeKey = getSizeKey(impression?.banner?.w, impression?.banner?.h);
  const sizeMultiplier = sizeKey ? (SIZE_MULTIPLIER[sizeKey] ?? 1.0) : 1.0;
  pCtr *= sizeMultiplier;

  // Expected value: what is this impression worth at this pCTR?
  // bid_price is the max CPM the advertiser is willing to pay
  // we scale it by how likely this impression is to perform
  const predictedCpm = campaign.bid_price * (pCtr / 0.01);

  return { campaign, predictedCpm, pCtr: parseFloat(pCtr.toFixed(4)) };
}
