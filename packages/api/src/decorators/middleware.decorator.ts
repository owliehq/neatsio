import { MetadataManager } from '../MetadataManager'
import { has, set } from 'dot-prop'
import { RequestHandler } from 'express'

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
