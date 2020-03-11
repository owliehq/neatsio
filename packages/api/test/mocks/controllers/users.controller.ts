import { Controller, Get, Body, Post } from '../../../src'

@Controller('users')
export default class UsersController {
  /**
   *
   */
  @Get()
  async findAll() {
    return [
      { lastname: 'DOE', firstname: 'John' },
      { lastname: 'SMITH', firstname: 'Bernie' }
    ]
  }

  /**
   *
   * @param body
   */
  @Post()
  async create(@Body body: any) {
    return body
  }
}
