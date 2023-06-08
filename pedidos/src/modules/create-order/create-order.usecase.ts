import { z } from "zod";
import { prismaClient } from "../../infra/database/prismaClient";
import axios from "axios";
import { KafkaSendMessage } from "../../infra/providers/kafka/producer";

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
    const verifyData = z.object({
      customerId: z.string().uuid(),
      items: z.object({
        productId: z.string().uuid(),
        quantity: z.number().min(0),
      }).array().min(1)
    });

    // Requisiçao para API de Produtos para verificar se tem estoque do produto
    // Neste caso axios.get
    // Caso tenha estoque cria order

    const products = (await prismaClient.product.findMany({
      select: {
        external_id: true,
        id: true
      },
      where: {
        id: {
          in: data.items.map(i => i.productId)
        }
      }

    }));

    for(let product of products) {
      const { data: {quantity, name} } = await axios.get<{ quantity: number, name: string }>
        (`http://product_service:4002/products/${product.external_id}`);
      if(quantity === 0) {
        throw new Error(`No product: ${name} in stock`)
      } else if (data.items.find(i => i.productId === product.id)!.quantity > quantity) {
        throw new Error(`Insufficient quantity of product: ${name} in stock \r\n ${quantity} Item${quantity > 1 ? 's' : ''}`)
      }
    }

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

    const kafkaSendMessage = new KafkaSendMessage();
    await kafkaSendMessage.execute('ORDERED_PRODUCTS', {
      products: data.items.map(i => ({...i, productId: products.find(p => p.external_id === i.productId)?.id}))
    });

    return order;
  }
}