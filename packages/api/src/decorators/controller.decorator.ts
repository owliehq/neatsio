import { Router } from 'express'
import { app } from '..'
import { RouteMethod, RouteMetadata } from '../interfaces/RouteMetadata'

import { MetadataManager } from '../MetadataManager'

/**
 *
 *
 */
function generateRoutes(router: Router, routesMetadata: { [key: string]: RouteMetadata }) {
  Object.values(routesMetadata).forEach((meta: RouteMetadata) => {
    switch (meta.method) {
      case RouteMethod.GET:
        router.get(meta.path, meta.handler)
        break
      case RouteMethod.POST:
        router.post(meta.path, meta.handler)
        break
      case RouteMethod.PUT:
        router.put(meta.path, meta.handler)
        break
      case RouteMethod.DELETE:
        router.delete(meta.path, meta.handler)
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

  generateRoutes(currentControllerClass.router, MetadataManager.meta.controllers[name].routes)

  app.registerController(currentControllerClass)

  return currentControllerClass
}
