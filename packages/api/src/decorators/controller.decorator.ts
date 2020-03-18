import { Router } from 'express'
import { app } from '..'
import { RouteMethod, RouteMetadata, MiddlewareMetadata } from '../interfaces/Metadata'

import { MetadataManager } from '../MetadataManager'

/**
 *
 *
 */
function generateRoutes(router: Router, controllerMetadata: any) {
  const routesMetadata: { [key: string]: RouteMetadata } = controllerMetadata.routes
  const middlewares: { [key: string]: any[] } = controllerMetadata.middlewares || {}

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
}

export const Controller = <T extends { new (...args: any[]): any }>(controllerName: string) => (constructor: T) => {
  const currentControllerClass: any = class extends constructor {
    public static router: Router = Router()
    public static controllerName = controllerName
    public static path = `/${controllerName}`
  }

  const { name } = constructor

  generateRoutes(currentControllerClass.router, MetadataManager.meta.controllers[name])

  app.registerController(currentControllerClass)

  return currentControllerClass
}
