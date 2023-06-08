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