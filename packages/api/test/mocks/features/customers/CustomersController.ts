import { Controller, Middleware, authMiddleware } from '../../../../src'

import Customer from './Customer'
import { NeatsioActions } from '../../../../src'

const controllerOptions = {
  model: Customer
}

@Controller('customers', controllerOptions)
export default class CustomersController {
  @Middleware(authMiddleware)
  async [NeatsioActions.GET_ONE]() {}
}
