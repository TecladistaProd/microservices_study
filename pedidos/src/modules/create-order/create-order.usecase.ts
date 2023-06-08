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