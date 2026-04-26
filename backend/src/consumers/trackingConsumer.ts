import { kafka, TOPICS } from "../lib/kafka";
import { TrackingEvent } from "@dsp/shared";

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
        console.log(
          `[impression] campaign=${event.campaignId} price=$${event.price} os=${event.os} app=${event.appBundle}`
        );
      } else if (event.type === "click") {
        console.log(
          `[click] campaign=${event.campaignId} requestId=${event.requestId}`
        );
      }
    },
  });

  console.log("[trackingConsumer] Listening on impressions + clicks topics");
}
