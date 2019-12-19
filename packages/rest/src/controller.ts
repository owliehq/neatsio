import { Router } from 'express'
import * as pluralize from 'pluralize'

import Service from './service'
import QueryParser from './query-parser'

import { AsyncWrapper, modelIdentifier } from './utils'

declare global {
  namespace Express {
    interface Request {
      parsedQuery: any
    }
  }
}

export default class Controller {
  /**
   *
   */
  public readonly router: Router

  /**
   *
   */
  public readonly service: Service

  /**
   *
   */
  private customRoutes: any

  /**
   *
   */
  private routeName: string

  /**
   *
   */
  private middlewares: any

  /**
   *
   */
  private models: Array<any> = []

  /**
   *
   * @param model
   * @param router
   */
  public constructor(service: Service, router: Router, params?: any) {
    params = params || {}

    this.service = service
    this.router = router
    this.routeName = pluralize.plural(this.service.modelName).toLowerCase()

    this.middlewares = params.middlewares ? params.middlewares : {}
    this.customRoutes = params.routes ? params.routes : []
  }

  /**
   * Build all routes via availables methods for the current model
   * DISCLAIMER: call order is important
   * @public
   */
  public buildRoutes() {
    this.buildCustomBeforeMiddlewares()
    this.buildQueryParserMiddleware()

    this.buildCustomRoutes()
    this.buildGetOneRoute()
    this.buildGetManyRoute()
    this.buildBulkPostRoute()
    this.buildOnePostRoute()
    this.buildBulkPutRoute()
    this.buildOnePutRoute()
    this.buildOneDeleteRoute()

    this.buildCustomAfterMiddlewares()
  }

  /**
   *
   */
  private buildCustomBeforeMiddlewares() {
    if (this.middlewares?.before?.length) this.router.use(this.mainRoute, this.middlewares.before)
  }

  private buildCustomAfterMiddlewares() {
    if (this.middlewares?.after?.length) this.router.use(this.mainRoute, this.middlewares.after)
  }

  /**
   *
   */
  private buildQueryParserMiddleware() {
    const middleware = AsyncWrapper(async (req, res, next) => {
      req.parsedQuery = new QueryParser(req.query, this.models)
      return next()
    })

    this.router.use(this.mainRoute, middleware)
  }

  /**
   *
   */
  private buildCustomRoutes() {
    this.customRoutes.forEach((route: any) => {
      this.router.use(this.mainRoute + route.path, AsyncWrapper(route.execute))
    })
  }

  /**
   * Populate the main router with GET /models/:id route
   *
   * @private
   */
  private buildGetOneRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.findById(req.params.id, req.parsedQuery)
      return res.status(200).json(response)
    })

    this.router.get(this.mainRouteWithId, callback)
  }

  /**
   * Populate the main router with GET /models route
   * Handle query parameters by passing them to the service
   *
   * @private
   */
  private buildGetManyRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.find(req.parsedQuery)
      return res.status(200).json(response)
    })

    this.router.get(this.mainRoute, callback)
  }

  /**
   *
   */
  private buildOnePostRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.createOne(req.body)
      return res.status(201).json(response)
    })

    this.router.post(this.mainRoute, callback)
  }

  /**
   *
   */
  private buildBulkPostRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.createBulk(req.body)
      return res.status(201).json(response)
    })

    this.router.post(this.mainRouteWithBulk, callback)
  }

  /**
   *
   */
  private buildOnePutRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.updateOne(req.params.id, req.body)
      return res.status(200).json(response)
    })

    this.router.put(this.mainRouteWithId, callback)
  }

  /**
   *
   */
  private buildBulkPutRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.updateBulk(req.body, req.parsedQuery)
      return res.status(200).json(response)
    })

    this.router.put(this.mainRouteWithBulk, callback)
  }

  /**
   *
   */
  private buildOneDeleteRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      await this.service.deleteOne(req.params.id)
      return res.status(200).json()
    })

    this.router.delete(this.mainRouteWithId, callback)
  }

  public setRegisteredModels(models: any) {
    this.models = models
  }

  /**
   * Create route string from model name
   * Useful for GET / POST methods
   *
   * @private
   */
  private get mainRoute() {
    return '/' + this.routeName
  }

  /**
   * Create subroute string with id param from mainRoute
   * Useful for GET / PUT / DELETE methods
   *
   * @private
   */
  private get mainRouteWithId() {
    return this.mainRoute + '/:id'
  }

  /**
   * Create subroute string with id param from mainRoute
   * Useful for GET / PUT / DELETE methods
   *
   * @private
   */
  private get mainRouteWithBulk() {
    return this.mainRoute + '/bulk'
  }
}
