import { providerContainer } from '../Injector'

export function Inject(target: any, propertyName: string): any {
  const meta = Reflect.getMetadata('design:type', target, propertyName)

  Object.defineProperty(target, propertyName, {
    get: () => providerContainer.resolve(meta.name),
    enumerable: true,
    configurable: true
  })
}
