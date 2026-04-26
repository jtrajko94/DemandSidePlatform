import { Campaign, BidRequest } from "@dsp/shared";

export function matchesCampaign(campaign: Campaign, bidRequest: BidRequest): boolean {
  // Budget check — never bid if daily budget is exhausted
  if (campaign.spend >= campaign.daily_budget) {
    return false;
  }

  const { device, app, imp } = bidRequest;
  const impression = imp[0];

  // OS targeting
  if (campaign.target_os && device?.os) {
    if (!campaign.target_os.includes(device.os)) {
      return false;
    }
  }

  // IAB category targeting — at least one category must overlap
  if (campaign.target_iab_cats && app?.cat) {
    const hasOverlap = app.cat.some((cat) =>
      campaign.target_iab_cats!.includes(cat)
    );
    if (!hasOverlap) {
      return false;
    }
  }

  // Banner size targeting — impression size must match one of the target sizes
  if (campaign.target_banner_sizes && impression?.banner) {
    const { w, h } = impression.banner;
    const sizeMatches = campaign.target_banner_sizes.some(
      (size) => size.w === w && size.h === h
    );
    if (!sizeMatches) {
      return false;
    }
  }

  return true;
}
