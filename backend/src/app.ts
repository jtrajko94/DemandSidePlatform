import Fastify from "fastify";
import { redis } from "./lib/redis";
import { producer } from "./lib/kafka";
import { loadCampaignsIntoRedis, startCampaignRefresh } from "./lib/campaignLoader";
import { startTrackingConsumer } from "./consumers/trackingConsumer";
import { healthRoutes } from "./routes/health";
import { bidRoutes } from "./routes/bid";
import { trackRoutes } from "./routes/track";
import { reportRoutes } from "./routes/report";

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Connect to Redis
  await redis.connect();
  app.log.info("Connected to Redis");

  // Connect Kafka producer
  await producer.connect();
  app.log.info("Kafka producer connected");

  // Load campaigns from Postgres into Redis, then start periodic refresh
  await loadCampaignsIntoRedis();
  startCampaignRefresh();

  // Start Kafka consumer
  await startTrackingConsumer();

  app.register(healthRoutes);
  app.register(bidRoutes);
  app.register(trackRoutes);
  app.register(reportRoutes);

  return app;
}
