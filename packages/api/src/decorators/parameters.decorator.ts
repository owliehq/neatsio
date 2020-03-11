import { MetadataManager } from '../MetadataManager'
import { set } from 'dot-prop'

export function Body(target: any, propertyName: string, index: number): void
export function Body(...args: any[]) {
  const [name] = args

  return (target: { [key: string]: any }, key: string, index: number) => {
    console.log('name', name)
    set(MetadataManager.meta, `controllers.${target.constructor.name}.routesParameters.${key}.${index}`, {
      getValue: (req: Request) => {
        return req.body
      }
    })
  }
}
