import {
  Controller,
  Middleware,
  authMiddleware,
  ValidationMiddleware,
  RoleMiddleware,
  NeatsioActions,
  AuthMiddleware
} from '../../../../src'

import { validationsCreateOne } from './CustomersValidations'

import Customer from './Customer'
import rights from './CustomersRights'

const controllerOptions = {
  model: Customer,
  rights
}

@Controller('customers', controllerOptions)
export default class CustomersController {
  @Middleware(authMiddleware)
  async [NeatsioActions.GET_ONE]() {}

  @AuthMiddleware()
  @ValidationMiddleware(validationsCreateOne)
  async [NeatsioActions.CREATE_ONE]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  async [NeatsioActions.GET_MANY]() {}
}
