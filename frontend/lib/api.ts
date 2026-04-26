export interface CampaignReport {
  campaign_id: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
}

export async function fetchCampaignReports(): Promise<CampaignReport[]> {
  const res = await fetch("/api/report/campaigns");
  if (!res.ok) throw new Error("Failed to fetch campaign reports");
  return res.json();
}
