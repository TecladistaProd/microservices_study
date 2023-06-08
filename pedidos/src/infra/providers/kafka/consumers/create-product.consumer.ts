import { prismaClient } from "../../../database/prismaClient";
import { kafkaConsumer } from "../kafka.consumer";

type TProductConsumer = {
  code: string;
  id: string;
}

export async function createProductConsumer() {
  console.log('PRODUCT CONSUMER')
  const consumer = await kafkaConsumer('PRODUCT_CREATED');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const product: TProductConsumer = JSON.parse(messageToString);

      console.log('PRODUCT: ', product)

      await prismaClient.product.create({
        data: {
          code: product.code,
          external_id: product.id
        }
      })
    },
  });
}

createProductConsumer();