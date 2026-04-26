import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "dsp-backend",
  brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"],
});

export const producer = kafka.producer();

export const TOPICS = {
  IMPRESSIONS: "impressions",
  CLICKS: "clicks",
} as const;
