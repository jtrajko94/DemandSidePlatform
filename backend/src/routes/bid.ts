import { FastifyInstance } from "fastify";
import { BidRequest, BidResponse, NosBidReason } from "@dsp/shared";

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

    // Hardcoded bid for now — targeting + scoring comes later
    const bidResponse: BidResponse = {
      id: bidRequest.id,
      cur: "USD",
      seatbid: [
        {
          seat: "dsp-1",
          bid: [
            {
              id: "bid-1",
              impid: bidRequest.imp[0].id,
              price: 1.5,  // $1.50 CPM
              adid: "ad-creative-001",
              crid: "creative-001",
              w: bidRequest.imp[0].banner?.w,
              h: bidRequest.imp[0].banner?.h,
            },
          ],
        },
      ],
    };

    return reply.code(200).send(bidResponse);
  });
}
