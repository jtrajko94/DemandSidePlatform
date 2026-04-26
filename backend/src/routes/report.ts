import { FastifyInstance } from "fastify";
import { db } from "../lib/postgres";

interface CampaignReport {
  campaign_id: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
}

export async function reportRoutes(app: FastifyInstance) {
  // All campaigns summary
  app.get("/report/campaigns", async () => {
    const result = await db.query<CampaignReport>(`
      SELECT
        i.campaign_id,
        COUNT(i.id)::int                          AS impressions,
        COUNT(c.id)::int                          AS clicks,
        ROUND(SUM(i.price)::numeric, 4)           AS spend,
        ROUND(
          CASE WHEN COUNT(i.id) = 0 THEN 0
               ELSE COUNT(c.id)::numeric / COUNT(i.id) * 100
          END, 2
        )                                          AS ctr
      FROM impressions i
      LEFT JOIN clicks c ON c.request_id = i.request_id
      GROUP BY i.campaign_id
      ORDER BY impressions DESC
    `);

    return result.rows;
  });

  // Single campaign
  app.get<{ Params: { id: string } }>("/report/campaigns/:id", async (request) => {
    const { id } = request.params;

    const result = await db.query<CampaignReport>(`
      SELECT
        i.campaign_id,
        COUNT(i.id)::int                          AS impressions,
        COUNT(c.id)::int                          AS clicks,
        ROUND(SUM(i.price)::numeric, 4)           AS spend,
        ROUND(
          CASE WHEN COUNT(i.id) = 0 THEN 0
               ELSE COUNT(c.id)::numeric / COUNT(i.id) * 100
          END, 2
        )                                          AS ctr
      FROM impressions i
      LEFT JOIN clicks c ON c.request_id = i.request_id
      WHERE i.campaign_id = $1
      GROUP BY i.campaign_id
    `, [id]);

    return result.rows[0] ?? { message: "No data for this campaign" };
  });
}
