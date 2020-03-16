import { MetadataManager } from '../MetadataManager'
import { set } from 'dot-prop'

interface BodyOptions {
  path: string
}
interface DecoratorParameters {
  target: { [key: string]: any }
  key: string
  index: number
}

function applyBody(parameters: Array<any>, options?: BodyOptions | string) {
  console.log('parameters', parameters)
  const target = parameters[0]
  const key = parameters[1]
  const index = parameters[2]
  set(MetadataManager.meta, `controllers.${target.constructor.name}.routesParameters.${key}.${index}`, {
    getValue: (req: Request) => {
      if (typeof options === 'string') {
        return options ? (req.body as any)[options] : req.body
      }
      return options ? (req.body as any)[options.path] : req.body
    }
  })
}

export function Body(target: any, propertyName: string, index: number): void
export function Body(name: string): Function
export function Body(options: BodyOptions): Function
export function Body(...args: any) {
  if (args.length > 2) {
    console.log('args', args)
    applyBody(args)
  }

  return (...parameters: any) => {
    console.log('parameters', parameters)
    applyBody(parameters, args[0])
  }
}
