import { Controller } from '../../../../src'

import User from './User'

const controllerOptions = {
  model: User
}

@Controller('users', controllerOptions)
export default class UsersController {}
