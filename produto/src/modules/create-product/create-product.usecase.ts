import { z } from 'zod';
import { prismaClient } from "../../infra/database/prismaClient";
import { KafkaSendMessage } from "../../infra/providers/kafka/producer";

type TCreateProductRequest = {
  name: string,
  code: string,
  quantity: number,
  price: number,
};

export class CreateProductUseCase {
  constructor() {}

  async execute(data: TCreateProductRequest) {
    const verifyData = z.object({
      name: z.string().min(2),
      code: z.string().min(5).max(7),
      quantity: z.number().min(0),
      price: z.number().min(.01),
    });
    verifyData.parse(data);
    const product = await prismaClient.product.findFirst({
      where: {
        code: data.code
      }
    });

    if(product) throw new Error('Product already exists!');

    const productCreated = await prismaClient.product.create({
      data: {
        ...data
      }
    });

    const kafkaMessage = new KafkaSendMessage();
    await kafkaMessage.execute('PRODUCT_CREATED', {
      id: productCreated.id,
      code: productCreated.code
    });

    return productCreated;
  }
}