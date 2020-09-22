import { asyncWrapper } from '@owliehq/async-wrapper'
import { RequestHandler, NextFunction } from 'express'
import { set, has } from 'dot-prop'

import { MetadataManager } from '../MetadataManager'
import { RouteMethod } from '../interfaces/Metadata'

const buildMethod = (method: RouteMethod) => (subRoute: string = '/', options: any = {}) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const obj = MetadataManager.meta
  const path = `controllers.${target.constructor.name}.routesParameters.${propertyKey}`

  if (options.requestHandler) {
    set(MetadataManager.meta, `controllers.${target.constructor.name}.routes.${propertyKey}`, {
      path: subRoute,
      method,
      handler: descriptor.value()
    })

    return
  }

  const handler = asyncWrapper(async (req, res) => {
    let result

    if (has(obj, path)) {
      const parameters = MetadataManager.meta.controllers[target.constructor.name].routesParameters[propertyKey]
      result = await descriptor.value(...Object.values(parameters).map((param: any) => param.getValue(req)))
      return res.status(200).json(result)
    }

    result = await descriptor.value()
    res.status(200).json(result)
  })

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
