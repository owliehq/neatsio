import { Router } from 'express'

// WTF require is needed...
const neatsio = require('@owliehq/neatsio')

import { RouteMethod, RouteMetadata, MiddlewareMetadata } from '../interfaces/Metadata'
import { MetadataManager } from '../MetadataManager'

import { app } from '..'
import { Model } from 'sequelize/types'

/**
 *
 *
 */
function generateRoutes(controllerMetadata: any): Router {
  if (!controllerMetadata) throw Error('Missing controller configuration')

  const routesMetadata: { [key: string]: RouteMetadata } = controllerMetadata.routes || {}
  const middlewares: { [key: string]: any[] } = controllerMetadata.middlewares || {}

  const router: Router = Router()

  Object.entries(routesMetadata).forEach(([key, meta]) => {
    const currentRouteMiddlewares = (middlewares[key] || []).reverse()

    switch (meta.method) {
      case RouteMethod.GET:
        router.get(meta.path, currentRouteMiddlewares, meta.handler)
        break
      case RouteMethod.POST:
        router.post(meta.path, currentRouteMiddlewares, meta.handler)
        break
      case RouteMethod.PUT:
        router.put(meta.path, currentRouteMiddlewares, meta.handler)
        break
      case RouteMethod.DELETE:
        router.delete(meta.path, currentRouteMiddlewares, meta.handler)
        break
    }
  })

  return router
}

/**
 *
 * @param controllerName
 */
export const Controller = <T extends { new (...args: any[]): any }>(
  controllerName: string,
  params: ControllerParams = {}
) => (constructor: T) => {
  //
  //

  //
  const currentControllerClass: any = class extends constructor {
    public static router: Router = Router()
    public static controllerName = controllerName
    public static path = `/${controllerName}`
  }

  const { name } = constructor

  //
  MetadataManager.registerController(name)

  //
  const routes = generateRoutes(MetadataManager.getControllerMetadata(name))

  if (params.model) {
    neatsio.registerModel(params.model)
  } else {
    currentControllerClass.router = routes
    app.registerController(currentControllerClass)
  }

  return currentControllerClass
}

interface ControllerParams {
  model?: { new (): Model } & typeof Model
}
