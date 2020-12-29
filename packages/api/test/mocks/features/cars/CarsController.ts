import { HttpError } from '@owliehq/http-errors'
import { Controller, Get, CurrentUser, AuthMiddleware, Query } from '../../../../src'

import { CarsService } from './CarsService'

@Controller('cars')
export default class CarsController {
  constructor(private carsService: CarsService) {
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
}
