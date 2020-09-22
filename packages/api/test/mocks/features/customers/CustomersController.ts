import { Request, Response } from 'express'

import {
  Controller,
  Middleware,
  authMiddleware,
  ValidationMiddleware,
  RoleMiddleware,
  NeatsioActions,
  AuthMiddleware,
  Get
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

  @Get('/:id/download', { requestHandler: true })
  download() {
    return (req: Request, res: Response) => {
      res.status(200).json({})
    }
  }
}
