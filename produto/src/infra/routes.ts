import { Router } from 'express';
import { CreateProductController } from '../modules/create-product/create-product.controller';
import { ReadProductController } from '../modules/read-product/read-product.controller';

const router = Router();

router.post('/products', (request, response) => {
  new CreateProductController().handle(request, response)
});

router.get('/products/:id', (request, response) => {
  new ReadProductController().handle(request, response)
});

export { router };