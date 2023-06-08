import { prismaClient } from "../../../database/prismaClient";
import { kafkaConsumer } from "../kafka.consumer";

type TCustomerConsumer = {
  email: string;
  id: string;
}

export async function createClientConsumer() {
  console.log('CLIENT CONSUMER')
  const consumer = await kafkaConsumer('CLIENT_CREATED');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const customer: TCustomerConsumer = JSON.parse(messageToString);

      console.log('CUSTOMER: ', customer)

      await prismaClient.customer.create({
        data: {
          email: customer.email,
          external_id: customer.id
        }
      })
    },
  });
}

createClientConsumer();