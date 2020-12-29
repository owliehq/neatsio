import { Class } from 'type-fest'

export const Injector = new (class {
  resolve<T>(target: Class<T>): T {
    const tokens = Reflect.getMetadata('design:paramtypes', target) || []

    const injections = tokens.map((token: any) => Injector.resolve<any>(token))

    return new target(...injections)
  }
})()
