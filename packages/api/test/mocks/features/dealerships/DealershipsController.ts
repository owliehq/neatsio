import { Controller, Get, Body, Post, Put, Params, Header, Delete } from '../../../../src'

@Controller('dealerships')
export default class DealershipsController {
  /**
   *
   */
  @Get()
  async findAll() {
    return [{ name: 'My best cars dealership' }, { name: '2 buckets car rooms' }]
  }

  /**
   *
   */
  @Post()
  async create(@Body body: any) {
    return body
  }

  /**
   *
   */
  @Put('/:id')
  async update(@Body('id') id2: string, @Body({ path: 'company.id' }) companyId: number, @Params('id') id: string) {
    return { companyId, id, id2 }
  }

  /**
   *
   */
  @Delete('/:companyId/:id')
  async delete(@Header('accept') acceptHeader: string, @Params('companyId') companyId: string) {
    return { acceptHeader, companyId }
  }
}
