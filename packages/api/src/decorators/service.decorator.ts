import { Class } from 'type-fest'
import { providerContainer } from '../Injector'

export const Service = <T extends { new (...args: any[]): any }>() => (constructor: T) => {
  providerContainer.addProvider(constructor)
  return constructor
}
