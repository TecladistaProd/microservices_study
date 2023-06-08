import { Request, Response } from "express";
import { UpdateOrderUseCase } from "./update-order.usecase";

export class UpdateOrderController {
  constructor() {}

  async handle(request: Request, response: Response) {
    const useCase = new UpdateOrderUseCase();

    try {
      const result = await useCase.execute(request.body);
      return response.status(200).json(result);
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