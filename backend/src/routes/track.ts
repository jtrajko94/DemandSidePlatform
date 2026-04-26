import { FastifyInstance } from "fastify";
import { ImpressionEvent, ClickEvent } from "@dsp/shared";
import { producer, TOPICS } from "../lib/kafka";

export async function trackRoutes(app: FastifyInstance) {
  app.post<{ Body: ImpressionEvent }>("/track/impression", async (request, reply) => {
    const event: ImpressionEvent = {
      ...request.body,
      type: "impression",
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: TOPICS.IMPRESSIONS,
      messages: [
        {
          key: event.requestId,
          value: JSON.stringify(event),
        },
      ],
    });

    return reply.code(200).send({ ok: true });
  });

  app.post<{ Body: ClickEvent }>("/track/click", async (request, reply) => {
    const event: ClickEvent = {
      ...request.body,
      type: "click",
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: TOPICS.CLICKS,
      messages: [
        {
          key: event.requestId,
          value: JSON.stringify(event),
        },
      ],
    });

    return reply.code(200).send({ ok: true });
  });
}
