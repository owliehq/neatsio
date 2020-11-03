import { MetadataManager } from '../MetadataManager'
import { set, get } from 'dot-prop'
import { Request } from 'express'

interface BodyOptions {
  path: string
}
interface DecoratorParameters {
  target: { [key: string]: any }
  key: string
  index: number
}

///
///
///
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
export function Body(...args: any): Function | void {
  if (args.length > 2) {
    applyBody(args)
    return
  }

  return (...parameters: any) => {
    applyBody(parameters, args[0])
  }
}

///
///
///
function applyParams(parameters: Array<any>, options?: string) {
  const target = parameters[0]
  const key = parameters[1]
  const index = parameters[2]

  set(MetadataManager.meta, `controllers.${target.constructor.name}.routesParameters.${key}.${index}`, {
    getValue: (req: Request) => {
      return !options ? req.params : (req.params as any)[options]
    }
  })
}

export function Params(target: any, propertyName: string, index: number): void
export function Params(name?: string): Function
export function Params(...args: any): Function | void {
  if (args.length > 2) {
    applyParams(args)
    return
  }

  return (...parameters: any) => {
    applyParams(parameters, args[0])
  }
}

///
///
///
function applyHeader(parameters: Array<any>, options?: string) {
  const target = parameters[0]
  const key = parameters[1]
  const index = parameters[2]

  set(MetadataManager.meta, `controllers.${target.constructor.name}.routesParameters.${key}.${index}`, {
    getValue: (req: Request) => {
      return !options ? req.headers : (req.headers as any)[options.toLowerCase()]
    }
  })
}

export function Header(target: any, propertyName: string, index: number): void
export function Header(name?: string): Function
export function Header(...args: any): Function | void {
  if (args.length > 2) {
    applyHeader(args)
    return
  }

  return (...parameters: any) => {
    applyHeader(parameters, args[0])
  }
}

///
///
///
function applyQuery(parameters: Array<any>, options?: string) {
  const target = parameters[0]
  const key = parameters[1]
  const index = parameters[2]

  set(MetadataManager.meta, `controllers.${target.constructor.name}.routesParameters.${key}.${index}`, {
    getValue: (req: Request) => {
      return !options ? req.query : (req.query as any)[options.toLowerCase()]
    }
  })
}

export function Query(target: any, propertyName: string, index: number): void
export function Query(name?: string): Function
export function Query(...args: any): Function | void {
  if (args.length > 2) {
    applyQuery(args)
    return
  }

  return (...parameters: any) => {
    applyQuery(parameters, args[0])
  }
}

/**
 *
 * @param target
 * @param propertyName
 * @param index
 */
export function CurrentUser(target: any, key: string, index: number) {
  set(MetadataManager.meta, `controllers.${target.constructor.name}.routesParameters.${key}.${index}`, {
    getValue: (req: Request) => {
      return req.user
    }
  })
}
