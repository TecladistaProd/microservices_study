import { prismaClient } from "../../../database/prismaClient";
import { kafkaConsumer } from "../kafka.consumer";

type TOrderConsumer = {
  products: {
    productId: string;
    quantity: number;
  }[]
}

export async function orderProductConsumer() {
  console.log('ORDER PRODUCT CONSUMER')
  const consumer = await kafkaConsumer('ORDERED_PRODUCTS');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const orderConsumer: TOrderConsumer = JSON.parse(messageToString);

      try {
        for(let product of orderConsumer.products) {
          await prismaClient.product.update({
            where: {
              id: product.productId
            },
            data: {
              quantity: {
                decrement: product.quantity
              }
            }
          });
        }
      } catch(err) {}
    },
  });
}

orderProductConsumer();