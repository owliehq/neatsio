import { MetadataManager } from '../MetadataManager'
import { has, set } from 'dot-prop'
import { RequestHandler } from 'express'
import { validationMiddleware } from '../middlewares'

/**
 *
 * @param middleware
 */
export const Middleware = (middleware: RequestHandler) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const path = `controllers.${target.constructor.name}.middlewares.${propertyKey}`

  if (!has(MetadataManager.meta, path)) {
    set(MetadataManager.meta, path, [])
  }

  MetadataManager.meta.controllers[target.constructor.name].middlewares[propertyKey].push(middleware)
}

/**
 *
 * @param validations
 */
export const ValidationMiddleware = (validations: any[]) => {
  return Middleware(validationMiddleware(validations))
}
