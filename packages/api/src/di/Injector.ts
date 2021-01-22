import { Class } from 'type-fest'
import 'reflect-metadata'

export const Injector = new (class {
  resolve<T>(target: Class<T>): T {
    const tokens = Reflect.getMetadata('design:paramtypes', target) || []

    const injections = tokens.map((token: any) => Injector.resolve<any>(token))

    return new target(...injections)
  }
})()

export class Container {
  private providers: Map<string, any> = new Map()

  resolve(target: string): any {
    const resolved = this.providers.get(target)

    if (!resolved) throw new Error(`No provider found for ${target}!`)

    return resolved
  }

  addProvider<T>(target: Class<T>) {
    this.providers.set(target.name, new target())
  }
}

export const providerContainer = new Container()

// PARAM INJECT DECORATOR

export function Inject(target: any, propertyName: string): any {
  const meta = Reflect.getMetadata('design:type', target, propertyName)

  Object.defineProperty(target, propertyName, {
    get: () => providerContainer.resolve(meta.name),
    enumerable: true,
    configurable: true
  })
}
