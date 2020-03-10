import { Controller, Get } from '../../../src'

@Controller('users')
export default class UsersController {
  @Get()
  async findAll() {
    return [
      { lastname: 'DOE', firstname: 'John' },
      { lastname: 'SMITH', firstname: 'Bernie' }
    ]
  }
}
