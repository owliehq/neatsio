import * as sequelize from 'sequelize'
import * as express from 'express'

import { Controller } from './controller'
import { modelIdentifier, NeatsioModel } from './utils'

/**
 *
 */
export default class Orchestrator {
  /**
   * Map of controllers registred by routeName
   */
  private controllers: { [name: string]: Controller }

  /**
   * Express router
   */
  private router: express.Router

  /**
   * Orchestrator's constructor
   * @constructor
   */
  constructor() {
    this.controllers = {}
    this.router = express.Router()
  }

  /**
   * Expose finally routes
   * @public
   */
  public get routes() {
    this.buildRoutes()
    return this.router
  }

  /**
   * Allow to record the models, one by one with verification of duplicate contents
   * Init and create afferent controller (by model name)
   * @public
   */
  public registerModel<M extends sequelize.Model>(model: NeatsioModel<M>, controllerParams?: any) {
    const service = modelIdentifier.getServiceFromModel(model)
    this.controllers[service.modelName] = new Controller(service, this.router, controllerParams)
  }

  /**
   * Prepare a router with all REST Routes, handling errors
   * And expose the router, must be exposed in a seperate getter
   */
  private buildRoutes() {
    // We go through current controllers and build REST routes one by one
    Object.values(this.controllers).forEach(controller => {
      controller.buildRoutes()
    })
  }

  /**
   * Get models
   */
  public get models() {
    return Object.values(this.controllers).reduce((result: any, controller) => {
      result[controller.service.modelName] = controller.service.model
      return result
    }, {})
  }

  /**
   *
   */
  public get servicesOptions() {
    return Object.values(this.controllers).reduce((result: any, controller) => {
      const { hiddenAttributes } = controller.service

      result[controller.service.modelName] = {
        hiddenAttributes: hiddenAttributes || []
      }

      return result
    }, {})
  }
}
