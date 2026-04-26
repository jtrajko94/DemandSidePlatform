export type CampaignStatus = "active" | "paused" | "completed";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;

  // Financials
  bid_price: number;
  daily_budget: number;
  total_budget: number;
  spend: number;

  // Targeting — null means no restriction on that dimension
  target_os: string[] | null;
  target_iab_cats: string[] | null;
  target_banner_sizes: Array<{ w: number; h: number }> | null;

  // Creative
  creative_id: string;

  created_at: string;
  updated_at: string;
}
