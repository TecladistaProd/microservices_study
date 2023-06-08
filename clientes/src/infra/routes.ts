import { Router } from 'express';
import { CreateClientController } from '../modules/create-client/create-client.controller';

const router = Router();

router.post('/clients', (request, response) => {
  new CreateClientController().handle(request, response)
})

export { router };