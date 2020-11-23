import { set, has } from 'dot-prop'

import { MetadataManager } from '../MetadataManager'
import { RouteMethod } from '../interfaces/Metadata'

const buildMethod = (method: RouteMethod) => (subRoute: string = '/', options: any = {}) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): any => {
  if (options.requestHandler) {
    set(MetadataManager.meta, `controllers.${target.constructor.name}.routes.${propertyKey}`, {
      path: subRoute,
      method,
      handler: descriptor.value()
    })

    return
  }

  const handler = async function(this: any, req: any, res: any) {
    const obj = MetadataManager.meta
    const path = `controllers.${target.constructor.name}.routesParameters.${propertyKey}`

    if (has(obj, path)) {
      const parameters = MetadataManager.meta.controllers[target.constructor.name].routesParameters[propertyKey]

      const result = await descriptor.value.apply(
        this,
        Object.values(parameters).map((param: any) => param.getValue(req))
      )
      return res.status(200).json(result)
    }

    const result = await descriptor.value.apply(this)
    res.status(200).json(result)
  }

  set(MetadataManager.meta, `controllers.${target.constructor.name}.routes.${propertyKey}`, {
    path: subRoute,
    method,
    handler
  })
}

export const Get = buildMethod(RouteMethod.GET)
export const Post = buildMethod(RouteMethod.POST)
export const Put = buildMethod(RouteMethod.PUT)
export const Delete = buildMethod(RouteMethod.DELETE)

export const Override = () => {}
