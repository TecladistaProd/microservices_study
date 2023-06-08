import { z } from 'zod';
import { prismaClient } from "../../infra/database/prismaClient";
import { KafkaSendMessage } from "../../infra/providers/kafka/producer";

type TUpdateOrderRequest = {
  id: string,
  status: string
};

export class UpdateOrderUseCase {
  constructor () {}

  async execute(data: TUpdateOrderRequest) {
    const verifyData = z.object({
      id: z.string().uuid(),
      status: z.string().min(5)
    });

    verifyData.parse(data);
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