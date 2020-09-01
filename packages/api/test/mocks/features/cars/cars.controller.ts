import { Controller, Get, Middleware, User } from '../../../../src'
import { authMiddleware } from '../../../../src/middlewares/AuthMiddleware'

@Controller('cars')
export default class CarsController {
  /**
   *
   */
  @Middleware(authMiddleware)
  @Get()
  async find(@User user: any) {
    const cars = [
      { registration: 'AA-000-BB', name: 'Renault Mégane', userId: 1 },
      { registration: 'CC-111-DD', name: 'Land Rover Evoque', userId: 2 }
    ]

    return cars.filter(car => car.userId === user.id)
  }
}
