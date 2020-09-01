import { Controller } from '../../../../src'

import Customer from './Customer'

const controllerOptions = {
  model: Customer
}

@Controller('customers', controllerOptions)
export default class CustomersController {}
