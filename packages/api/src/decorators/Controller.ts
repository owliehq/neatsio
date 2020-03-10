import { Router } from 'express'
import { app } from '../'

/**
 *
 * @param controllerName
 */
export const Controller = <T extends { new (...args: any[]): any }>(controllerName: string) => (constructor: T) => {
  const currentControllerClass: any = class extends constructor {
    public router: Router = Router()
    public name = controllerName

    public get path() {
      return `/${this.name}`
    }
  }

  app.registerController(currentControllerClass)

  return currentControllerClass
}
