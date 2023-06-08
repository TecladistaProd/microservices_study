import { prismaClient } from "../../infra/database/prismaClient";
import { KafkaSendMessage } from "../../infra/providers/kafka/producer";

type TUpdateOrderRequest = {
  id: string,
  status: string
};

export class UpdateOrderUseCase {
  constructor () {}

  async execute(data: TUpdateOrderRequest) {
    const orderUpdate = await prismaClient.order.update({
      where: {
        id: data.id,
      },
      data: {
        status: data.status
      },
      include: {
        customer: true
      }
    });

    const kafkasendMessage = new KafkaSendMessage();
    await kafkasendMessage.execute('ORDER_STATUS', {
      customerId: orderUpdate.customer.external_id,
      status: orderUpdate.status
    });
  }
}