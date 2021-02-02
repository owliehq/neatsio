import { CarsService } from './mocks/features/cars/CarsService'
import { RegistrationService } from './mocks/features/cars/RegistrationService'
import { InjectionTest, simpleFunctionInjectionInvoke } from './mocks/injection'

describe('Injection tests', () => {
  it('should return param type', () => {
    const injectionInstance = new InjectionTest()
  })

  it('should return cars from a CarService on a simple function via resolver, no injection', () => {
    expect(simpleFunctionInjectionInvoke()).toHaveLength(2)
  })
})
