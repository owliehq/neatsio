import { Injector } from '../di/Injector'

export const Service = <T extends { new (...args: any[]): any }>() => {
  return (constructor: T) => {
    // TODO: save into a provider container

    const serviceClass: any = class ServiceConstructor extends constructor {
      public static instance = Injector.resolve<T>(constructor)
    }

    return serviceClass
  }
}
