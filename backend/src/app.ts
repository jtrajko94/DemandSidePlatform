import Fastify from "fastify";
import { redis } from "./lib/redis";
import { loadCampaignsIntoRedis, startCampaignRefresh } from "./lib/campaignLoader";
import { healthRoutes } from "./routes/health";
import { bidRoutes } from "./routes/bid";

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Connect to Redis
  await redis.connect();
  app.log.info("Connected to Redis");

  // Load campaigns from Postgres into Redis, then start periodic refresh
  await loadCampaignsIntoRedis();
  startCampaignRefresh();

  app.register(healthRoutes);
  app.register(bidRoutes);

  return app;
}
