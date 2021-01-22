import { Class } from 'type-fest'
import { providerContainer } from '../di/Injector'

export const Service = <T extends { new (...args: any[]): any }>() => (constructor: T) => {
  providerContainer.addProvider(constructor)
  return constructor
}
