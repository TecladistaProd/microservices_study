import { Request, Response } from 'express';
import { CreateOrderUseCase } from './create-order.usecase';

export class CreateOrderController {
  constructor() {}

  async handle(request: Request, response: Response) {
    const useCase = new CreateOrderUseCase();

    try {
      const result = await useCase.execute(request.body);
      return response.status(201).json(result);
    } catch(err) {
      if(err instanceof Error)
        return response.status(400).json({
          message: err.message,
          stack: err.stack
        });
      return response.status(400).json(err);
    }
  }
}