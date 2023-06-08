import { Partitioners } from 'kafkajs';
import { kafka } from ".";

export class KafkaSendMessage {
  async execute(topic: string, payload: any): Promise<void> {
    const producer = kafka.producer({
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.LegacyPartitioner
    });

    await producer.connect();
    console.log(`MESSAGE SENT TO TOPIC ${topic} \r\n ${JSON.stringify(payload, null, 2)}`)
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(payload)
        }
      ]
    });

    await producer.disconnect();
  }
}