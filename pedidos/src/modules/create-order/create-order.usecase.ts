import { z } from "zod";
import { prismaClient } from "../../infra/database/prismaClient";

type TCreateOrderRequest = {
  customerId: string,
  items: {
    productId: string,
    quantity: number
  }[],
};

export class CreateOrderUseCase {
  constructor() {}

  async execute(data: TCreateOrderRequest) {
    // Requisiçao para API de Produtos para verificar se tem estoque do produto
    // Neste caso axios.get
    // Caso tenha estoque cria order

    const verifyData = z.object({
      customerId: z.string().uuid(),
      items: z.object({
        productId: z.string().uuid(),
        quantity: z.number().min(0),
      }).array().min(1)
    });

    verifyData.parse(data);

    const order = await prismaClient.order.create({
      data: {
        customerId: data.customerId,
        status: 'AGUARDANDO_PAGAMENTO',
        orderItems: {
          createMany: {
            data: data.items
          }
        }
      }
    });

    return order;
  }
}