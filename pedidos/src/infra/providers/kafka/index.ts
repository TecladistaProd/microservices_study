import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: 'orders',
  brokers: ['kafka1:9092', 'kafka2:9092', 'kafka3:9092']
});