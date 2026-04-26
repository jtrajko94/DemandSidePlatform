import { FastifyInstance } from "fastify";
import { BidRequest, BidResponse, NosBidReason, Campaign } from "@dsp/shared";
import { getCampaignsFromRedis } from "../lib/campaignLoader";
import { matchesCampaign } from "../lib/targeting";
import { scoreCampaign } from "../lib/scoring";

export async function bidRoutes(app: FastifyInstance) {
  app.post<{ Body: BidRequest }>("/bid", async (request, reply) => {
    const bidRequest = request.body;

    if (!bidRequest.imp || bidRequest.imp.length === 0) {
      const noBid: BidResponse = {
        id: bidRequest.id,
        nbr: NosBidReason.InvalidRequest,
      };
      return reply.code(204).send(noBid);
    }

    const campaigns = await getCampaignsFromRedis();
    const eligible = campaigns.filter((c) => matchesCampaign(c, bidRequest));

    if (eligible.length === 0) {
      return reply.code(204).send({
        id: bidRequest.id,
        nbr: NosBidReason.NoMatchingCampaign,
      });
    }

    // Score each eligible campaign and pick the highest predicted CPM
    const scored = eligible.map((c) => scoreCampaign(c, bidRequest));
    const winner = scored.reduce((best, s) =>
      s.predictedCpm > best.predictedCpm ? s : best
    );

    const imp = bidRequest.imp[0];

    const bidResponse: BidResponse = {
      id: bidRequest.id,
      cur: "USD",
      seatbid: [
        {
          seat: "dsp-1",
          bid: [
            {
              id: `bid-${Date.now()}`,
              impid: imp.id,
              price: parseFloat(winner.predictedCpm.toFixed(4)),
              adid: winner.campaign.id,
              crid: winner.campaign.creative_id,
              w: imp.banner?.w,
              h: imp.banner?.h,
            },
          ],
        },
      ],
    };

    return reply.code(200).send(bidResponse);
  });
}
