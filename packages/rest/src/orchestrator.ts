import * as sequelize from 'sequelize'
import * as express from 'express'

import HttpError from './http-error'
import Controller from './controller'

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
  public registryModel<M extends sequelize.Model>(model: NeatsioModel<M>, controllerParams?: any) {
    const service = modelIdentifier.getServiceFromModel(model)
    this.controllers[service.modelName] = new Controller(service, this.router, controllerParams)
  }

  /**
   * Prepare a router with all REST Routes, handling errors
   * And expose the router, must be exposed in a seperate getter
   * @private
   */
  private buildRoutes() {
    // We go through current controllers and build REST routes one by one
    Object.values(this.controllers).forEach(controller => {
      controller.setRegisteredModels(this.models)
      controller.buildRoutes()
    })

    // Add handling for try/catch error (async) and
    // finish with 404 error if route wasn't found
    this.buildErrorRouteHandler()
  }

  /**
   * Prepare current router with error handling,
   * send HTTP error to client
   * @private
   */
  private buildErrorRouteHandler() {
    // Catch errors that could be thrown everywhere in the lib
    // Carefull: express routes only
    this.router.use(
      '/',
      (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        const status = err.statusCode || 500

        if (status === 500) err = HttpError.InternalServerError()
        res.status(status).json(err)
      }
    )

    // When no middleware is called, there's no collection match
    // with the request, result to 404 error
    this.router.use('/', (req, res) => {
      res.status(404).send(HttpError.NotFound())
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
}
