import { MetadataManager } from '../MetadataManager'
import { has, set } from 'dot-prop'
import { RequestHandler } from 'express'
import { singular } from 'pluralize'
import { validationMiddleware, authMiddleware, roleMiddleware } from '../middlewares'

/**
 *
 * @param middleware
 */
export const Middleware = (middleware: RequestHandler) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => registerMiddleware(target, propertyKey, descriptor, middleware)

/**
 *
 * @param validations
 */
export const ValidationMiddleware = (validations: any[]) => {
  return Middleware(validationMiddleware(validations))
}

/**
 *
 */
export const AuthMiddleware = () => {
  return Middleware(authMiddleware)
}

/**
 *
 */
export const RoleMiddleware = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const name = target.constructor.name

    const isController = name?.substring(name.length - 10) === 'Controller'

    if (!isController) throw new Error(`Controller name's must finish with "Controller"`)

    const resource = singular(name.substring(0, name.length - 10)).toLowerCase()

    const currentRoleMiddleware = roleMiddleware(resource, propertyKey)

    registerMiddleware(target, propertyKey, descriptor, currentRoleMiddleware)
  }
}

/**
 *
 * @param target
 * @param propertyKey
 * @param descriptor
 */
function registerMiddleware(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  middleware: RequestHandler
) {
  const path = `controllers.${target.constructor.name}.middlewares.${propertyKey}`

  if (!has(MetadataManager.meta, path)) {
    set(MetadataManager.meta, path, [])
  }

  MetadataManager.meta.controllers[target.constructor.name].middlewares[propertyKey].push(middleware)
}
