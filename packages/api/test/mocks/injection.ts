import { Inject, providerContainer } from '../../src'
import { CarsService } from './features/cars/CarsService'

export class InjectionTest {
  @Inject private carService: CarsService

  constructor() {
    //this.carService.addCars()
  }
}

export const simpleFunctionInjectionInvoke = () => {
  const carService = providerContainer.resolve(CarsService) as CarsService
  carService.addCars()
  return carService.getCars()
}
