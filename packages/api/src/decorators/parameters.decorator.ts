import { MetadataManager } from '../MetadataManager'
import { set, get } from 'dot-prop'

interface BodyOptions {
  path: string
}
interface DecoratorParameters {
  target: { [key: string]: any }
  key: string
  index: number
}

function applyBody(parameters: Array<any>, options?: BodyOptions | string) {
  const target = parameters[0]
  const key = parameters[1]
  const index = parameters[2]
  set(MetadataManager.meta, `controllers.${target.constructor.name}.routesParameters.${key}.${index}`, {
    getValue: (req: Request) => {
      // Without string or object params, return the whole body
      if (!options) return req.body

      const path = typeof options === 'string' ? options : options?.path

      if (!path) throw new Error(`Options Malformatted`)

      return get(req.body as any, path)
    }
  })
}

export function Body(target: any, propertyName: string, index: number): void
export function Body(name: string): Function
export function Body(options: BodyOptions): Function
export function Body(...args: any) {
  if (args.length > 2) {
    applyBody(args)
  }

  return (...parameters: any) => {
    applyBody(parameters, args[0])
  }
}
