import { Controller, Get, CurrentUser, AuthMiddleware } from '../../../../src'

@Controller('cars')
export default class CarsController {
  @AuthMiddleware()
  @Get()
  async find(@CurrentUser user: any) {
    const cars = [
      { registration: 'AA-000-BB', name: 'Renault Mégane', userId: 1 },
      { registration: 'CC-111-DD', name: 'Land Rover Evoque', userId: 2 }
    ]

    return cars.filter(car => car.userId === user.id)
  }
}
