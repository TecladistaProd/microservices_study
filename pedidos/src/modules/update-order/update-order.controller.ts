import { Request, Response } from "express";
import { ZodError } from 'zod';
import { UpdateOrderUseCase } from "./update-order.usecase";

export class UpdateOrderController {
  constructor() {}

  async handle(request: Request, response: Response) {
    const useCase = new UpdateOrderUseCase();

    try {
      const result = await useCase.execute({...request.body, ...request.params});
      return response.status(200).json(result);
    } catch(err) {
      if(err instanceof ZodError)
        return response.status(400).json({
          message: JSON.parse(err.message),
        });
      else if(err instanceof Error)
        return response.status(400).json({
          message: err.message,
        });
      return response.status(400).json(err);
    }
  }
}