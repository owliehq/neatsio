import { HttpError } from '@owliehq/http-errors'
import { Controller, Get, CurrentUser, AuthMiddleware, Query, Params } from '../../../../src'
import { Inject } from '../../../../src'

import { CarsService } from './CarsService'

@Controller('cars')
export default class CarsController {
  @Inject private carsService: CarsService

  constructor() {
    this.carsService.addCars()
  }

  @AuthMiddleware()
  @Get()
  async find(@CurrentUser user: any) {
    const cars = this.carsService.getCars()
    return cars.filter(car => car.userId === user.id)
  }

  @Get('/service')
  async findAll() {
    const cars = this.carsService.getCars()
    return cars
  }

  @Get('/query')
  query(@Query('code') code: string) {
    return { code }
  }

  @Get('/requesthandler/:id', { requestHandler: true })
  requestHandler(@Params('id') id: string) {
    const retrieveKey = async (idLa: string) => {
      return idLa
    }

    return async (req: any, res: any) => {
      this.carsService.reset()
      this.carsService.addCars()

      const retrievedId = await retrieveKey(id)

      res.json({ cars: this.carsService.getCars(), id: retrievedId })
    }
  }
}
