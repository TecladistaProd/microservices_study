import { z } from "zod";
import { prismaClient } from "../../infra/database/prismaClient";
import { KafkaSendMessage } from "../../infra/provider/kafka/producer";

type TCreateClientRequest = {
  name: string,
  password: string,
  email: string,
  phone: string
};

export class CreateClientUseCase {
  constructor() {}

  async execute(data: TCreateClientRequest) {
    const verifyData = z.object({
      name: z.string().max(50).min(3),
      password: z.string(),
      email: z.string().email(),
      phone: z.string()
    });

    verifyData.parse(data);

    const customer = await prismaClient.client.findFirst({
      where: {
        email: data.email
      }
    });

    if(customer) throw new Error('Customer already exists!');

    const clientCreated = await prismaClient.client.create({
      data: {
        ...data
      }
    });

    // Chamar Microserviço de PEDIDO para cadastrar Customer
    // Usando Kafka ou RabbitMQ

    const kafkaProducer = new KafkaSendMessage();
    await kafkaProducer.execute('CLIENT_CREATED', {
      id: clientCreated.id,
      email: clientCreated.email
    });

    return clientCreated;
  }
}