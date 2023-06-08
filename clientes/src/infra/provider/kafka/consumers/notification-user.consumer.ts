import { kafkaConsumer } from "../kafka.consumer";

type TStatusConsumer = {
  status: string;
  customerId: string;
}

export async function notificationUserConsumer() {
  console.log('NOTIFICATION USER CONSUMER')
  const consumer = await kafkaConsumer('ORDER_STATUS');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageToString = message.value!.toString();
      const statusConsumer: TStatusConsumer = JSON.parse(messageToString);

      // Enviar Mensagem Via E-mail
      console.log(`CLIENTE - ${statusConsumer.customerId}\r\nSTATUS - ${statusConsumer.status}`);
    },
  });
}

notificationUserConsumer();