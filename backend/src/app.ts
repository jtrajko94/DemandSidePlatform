import Fastify from "fastify";
import { healthRoutes } from "./routes/health";
import { bidRoutes } from "./routes/bid";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(healthRoutes);
  app.register(bidRoutes);

  return app;
}
