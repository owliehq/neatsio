import { providerContainer } from '../Injector'

export function Inject(target: any, propertyName: string): any {
  const meta = Reflect.getMetadata('design:type', target, propertyName)
  if(!meta) throw new Error(`metadata for ${propertyName} in ${target.constructor.name} is not available`)
  Object.defineProperty(target, propertyName, {
    get: () => providerContainer.resolve(meta.name),
    enumerable: true,
    configurable: true
  })
}
