import { Controller, Get, Body, Post, Put } from '../../../src'

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
   */
  @Post()
  async create(@Body body: any) {
    return body
  }

  @Put()
  async update(@Body('company.name') companyName: string, @Body({ path: 'company.id' }) companyId: number) {
    return companyId
  }
}
