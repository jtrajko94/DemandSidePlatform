import { FastifyInstance } from "fastify";
import { BidRequest, BidResponse, NosBidReason, Campaign } from "@dsp/shared";
import { getCampaignsFromRedis } from "../lib/campaignLoader";
import { matchesCampaign } from "../lib/targeting";

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

    // Pick the highest-paying eligible campaign
    const winner = eligible.reduce((best: Campaign, c: Campaign) =>
      c.bid_price > best.bid_price ? c : best
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
              price: winner.bid_price,
              adid: winner.id,
              crid: winner.creative_id,
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
