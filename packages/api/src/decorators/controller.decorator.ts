import { Router } from 'express'

// WTF require is needed...
const neatsio = require('@owliehq/neatsio')

import { RouteMethod, RouteMetadata, MiddlewareMetadata } from '../interfaces/Metadata'
import { MetadataManager } from '../MetadataManager'

import { app } from '..'
import { Model } from 'sequelize/types'
import { NeatsioActions } from '../interfaces/NeatsioActions'

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

  const controllerMetadata = MetadataManager.getControllerMetadata(name)

  //
  const routes = generateRoutes(controllerMetadata)

  if (params.model) {
    const neatsioRoutes = getNeatsioRoutesConfig(currentControllerClass)

    const config = buildNeatsioConfig(controllerMetadata, neatsioRoutes)

    neatsio.registerModel(params.model, config)
  } else {
    currentControllerClass.router = routes
    app.registerController(currentControllerClass)
  }

  return currentControllerClass
}

function buildNeatsioConfig(controllerMetadata: any, routes: any) {
  const middlewares = Object.entries(routes).reduce((result: any, entry) => {
    const action: string = entry[0]
    const key: string = entry[1] as string

    if (controllerMetadata?.middlewares.hasOwnProperty(action)) {
      if (!result[key]) result[key] = { before: [], after: [] }

      // handle after ?
      result[key].before = controllerMetadata.middlewares[action]
    }

    return result
  }, {})

  return {
    middlewares
  }
}

/**
 *
 */
function getAllMethods(obj: any) {
  let props: string[] = []

  do {
    const l = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
      .sort()
      .filter(
        (p, i, arr) =>
          typeof obj[p] === 'function' && p !== 'constructor' && (i == 0 || p !== arr[i - 1]) && props.indexOf(p) === -1
      )
    props = props.concat(l)
  } while ((obj = Object.getPrototypeOf(obj)) && Object.getPrototypeOf(obj))

  return props
}

/**
 *
 */
function getNeatsioRoutesConfig<T extends { new (...args: any[]): any }>(controllerClass: T) {
  const instance = new controllerClass()
  const methods = getAllMethods(instance)

  const neatsioActions: string[] = Object.values(NeatsioActions)

  return methods
    .filter((method: string) => neatsioActions.includes(method))
    .reduce((result: any, action: string) => {
      const cleanActionName = action.substr(7)

      result[action] = cleanActionName.charAt(0).toLowerCase() + cleanActionName.slice(1)

      return result
    }, {})
}

interface ControllerParams {
  model?: { new (): Model } & typeof Model
}