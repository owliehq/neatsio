import { Request, Response } from 'express'

import {
  Controller,
  Middleware,
  authMiddleware,
  ValidationMiddleware,
  RoleMiddleware,
  NeatsioActions,
  AuthMiddleware,
  Get,
  Params
} from '../../../../src'

import { validationsCreateOne } from './CustomersValidations'

import Customer from './Customer'
import rights from './CustomersRights'
import { Inject } from '../../../../src'
import { CustomerService } from './CustomerService'

const controllerOptions = {
  model: Customer,
  rights
}

@Controller('customers', controllerOptions)
export default class CustomersController {
  @Inject private customerService: CustomerService

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

  @Get('/email/:email')
  async getEmail(@Params('email') email: string) {
    return this.customerService.findByEmail(email)
  }
}
