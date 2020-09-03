import { Controller, Middleware, authMiddleware, ValidationMiddleware, NeatsioActions } from '../../../../src'

import { validationsCreateOne } from './CustomersValidations'

import Customer from './Customer'

const controllerOptions = {
  model: Customer
}

@Controller('customers', controllerOptions)
export default class CustomersController {
  @Middleware(authMiddleware)
  async [NeatsioActions.GET_ONE]() {}

  @ValidationMiddleware(validationsCreateOne)
  async [NeatsioActions.CREATE_ONE]() {}
}
