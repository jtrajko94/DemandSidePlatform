import { kafka, TOPICS } from "../lib/kafka";
import { TrackingEvent } from "@dsp/shared";
import { db } from "../lib/postgres";

const consumer = kafka.consumer({ groupId: "tracking-consumer" });

export async function startTrackingConsumer(): Promise<void> {
  await consumer.connect();
  await consumer.subscribe({
    topics: [TOPICS.IMPRESSIONS, TOPICS.CLICKS],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString()) as TrackingEvent;

      if (event.type === "impression") {
        await db.query(
          `INSERT INTO impressions (request_id, campaign_id, creative_id, price, os, app_bundle)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (request_id) DO NOTHING`,
          [event.requestId, event.campaignId, event.creativeId, event.price, event.os, event.appBundle]
        );
        console.log(`[impression] saved — campaign=${event.campaignId} price=$${event.price}`);
      } else if (event.type === "click") {
        await db.query(
          `INSERT INTO clicks (request_id, campaign_id)
           VALUES ($1, $2)
           ON CONFLICT (request_id) DO NOTHING`,
          [event.requestId, event.campaignId]
        );
        console.log(`[click] saved — campaign=${event.campaignId} requestId=${event.requestId}`);
      }
    },
  });

  console.log("[trackingConsumer] Listening on impressions + clicks topics");
}
