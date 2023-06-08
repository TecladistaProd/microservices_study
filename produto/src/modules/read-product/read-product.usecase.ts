import { z } from 'zod';
import { prismaClient } from "../../infra/database/prismaClient";

export class ReadProductUseCase {
  constructor() {}

  async execute(data: string) {
    const verifyData = z.string().uuid();
    verifyData.parse(data);
    const product = await prismaClient.product.findUnique({
      where: {
        id: data
      }
    });
    return product;
  }
}