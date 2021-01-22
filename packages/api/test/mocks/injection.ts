import { Inject } from '../../src/di/Injector'
import { CarsService } from './features/cars/CarsService'

export class InjectionTest {
  @Inject private carService: CarsService

  constructor() {
    this.carService.addCars()
  }
}
