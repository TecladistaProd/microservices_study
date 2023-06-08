import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { CreateProductUseCase } from './create-product.usecase';

export class CreateProductController {
  constructor() {}

  async handle(request: Request, response: Response) {
    const useCase = new CreateProductUseCase();

    try {
      const result = await useCase.execute(request.body);
      return response.status(201).json(result);
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