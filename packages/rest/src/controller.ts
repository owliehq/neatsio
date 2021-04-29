import { Router } from 'express'
import * as pluralize from 'pluralize'

import Service from './services/service'
import QueryParser from './query-parser'

import { AsyncWrapper } from './utils'

declare global {
  namespace Express {
    interface Request {
      parsedQuery: any
      results?: any
    }
  }
}

/**
 *
 */
export class Controller {
  /**
   *
   */
  constructor(
    public readonly service: Service,
    public readonly router: Router,
    private middlewares: any,
    private customRoutes: any = [],
    private queryOptions: any,
    private unauthorizedRoutes: Array<String> = [],
    private routeName?: string
  ) {
    //this.customRoutes = params.routes || []

    this.setRouteName(routeName)
  }

  /**
   *
   */
  public static init<T extends typeof Controller>(
    this: T,
    service: Service,
    router: Router,
    params?: any
  ): InstanceType<T> {
    params = params || {}

    const { middlewares, routes, queryOptions, unauthorizedRoutes }: any = {
      middlewares: {
        before: [],
        after: [],
        getOne: [],
        getMany: [],
        query: [],
        queryCount: [],
        createOne: [],
        createBulk: [],
        updateOne: [],
        updateBulk: [],
        deleteOne: []
      },
      ...params
    }

    return new this(service, router, middlewares, routes, queryOptions, unauthorizedRoutes) as InstanceType<T>
  }

  /**
   * Build all routes via availables methods for the current model
   * DISCLAIMER: call order is important
   */
  public buildRoutes() {
    this.buildCustomBeforeMiddlewares()
    this.buildCustomRoutes()

    if(!this.unauthorizedRoutes.includes('count')) this.buildCountRoute()
    if(!this.unauthorizedRoutes.includes('query')) this.buildQueryRoute()
    if(!this.unauthorizedRoutes.includes('queryCount')) this.buildQueryCountRoute()
    if(!this.unauthorizedRoutes.includes('getOne')) this.buildGetOneRoute()
    if(!this.unauthorizedRoutes.includes('getMany')) this.buildGetManyRoute()
    if(!this.unauthorizedRoutes.includes('createBulk')) this.buildBulkPostRoute()
    if(!this.unauthorizedRoutes.includes('createOne')) this.buildOnePostRoute()
    if(!this.unauthorizedRoutes.includes('updateBulk')) this.buildBulkPutRoute()
    if(!this.unauthorizedRoutes.includes('updateOne')) this.buildOnePutRoute()
    if(!this.unauthorizedRoutes.includes('deleteBulk')) this.buildBulkDeleteRoute()
    if(!this.unauthorizedRoutes.includes('deleteOne')) this.buildOneDeleteRoute()

    this.buildCustomAfterMiddlewares()
  }

  /**
   *
   */
  private buildCustomBeforeMiddlewares() {
    if (this.middlewares?.before?.length) this.router.use(this.mainRoute, this.middlewares.before)
  }

  /**
   *
   */
  private buildCustomAfterMiddlewares() {
    if (this.middlewares?.after?.length) this.router.use(this.mainRoute, this.middlewares.after)
  }

  /**
   *
   */
  private buildCustomRoutes() {
    this.customRoutes.forEach((route: any) => {
      const middlewares = route.middlewares || []
      this.router.use(this.mainRoute + route.path, middlewares, route.execute)
    })
  }

  /**
   * Populate the main router with GET /models/:id route
   */
  private buildGetOneRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.findById(req.params.id, req.parsedQuery)
      return res.status(200).json(response)
    })

    const beforeMiddlewares = this.middlewares?.getOne?.before || []

    this.router.get(this.mainRouteWithId, [...beforeMiddlewares, this.getQueryParserMiddleware(), callback])
  }

  /**
   * Populate the main router with GET /models route
   * Handle query parameters by passing them to the service
   */
  private buildGetManyRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.find(req.parsedQuery)
      return res.status(200).json(response)
    })

    const beforeMiddlewares = this.middlewares?.getMany?.before || []

    this.router.get(this.mainRoute, [...beforeMiddlewares, this.getQueryParserMiddleware(), callback])
  }

  /**
   *
   */
  private buildCountRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.count(req.parsedQuery)
      return res.status(200).json(response)
    })

    const beforeMiddlewares = this.middlewares?.count?.before || []

    this.router.get(this.mainRouteWithCount, [...beforeMiddlewares, this.getQueryParserMiddleware(), callback])
  }

  /**
   *
   */
  private buildQueryRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.find(req.parsedQuery)
      return res.status(200).json(response)
    })

    const beforeMiddlewares = this.middlewares?.query?.before || []

    this.router.post(this.mainRouteWithQuery, [...beforeMiddlewares, this.getQueryParserMiddleware(true), callback])
  }

  /**
   *
   */
  private buildQueryCountRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.count(req.parsedQuery)
      return res.status(200).json(response)
    })

    const beforeMiddlewares = this.middlewares?.queryCount?.before || []

    this.router.post(this.mainRouteWithQueryCount, [
      ...beforeMiddlewares,
      this.getQueryParserMiddleware(true),
      callback
    ])
  }

  /**
   *
   */
  private buildOnePostRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.createOne(req.body, req.parsedQuery)
      return res.status(201).json(response)
    })

    const beforeMiddlewares = this.middlewares?.createOne?.before || []

    this.router.post(this.mainRoute, [...beforeMiddlewares, this.getQueryParserMiddleware(), callback])
  }

  /**
   *
   */
  private buildBulkPostRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.createBulk(req.body)
      return res.status(201).json(response)
    })

    const beforeMiddlewares = this.middlewares?.createBulk?.before || []

    this.router.post(this.mainRouteWithBulk, [...beforeMiddlewares, callback])
  }

  /**
   *
   */
  private buildOnePutRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.updateOne(req.params.id, req.body, req.parsedQuery)
      return res.status(200).json(response)
    })

    const beforeMiddlewares = this.middlewares?.updateOne?.before || []

    this.router.put(this.mainRouteWithId, [...beforeMiddlewares, this.getQueryParserMiddleware(), callback])
  }

  /**
   *
   */
  private buildBulkPutRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.updateBulk(req.body, req.parsedQuery)
      return res.status(200).json(response)
    })

    const beforeMiddlewares = this.middlewares?.updateBulk?.before || []

    this.router.put(this.mainRouteWithBulk, [...beforeMiddlewares, this.getQueryParserMiddleware(), callback])
  }

  /**
   *
   */
  private buildOneDeleteRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      await this.service.deleteOne(req.params.id)
      return res.status(200).json()
    })

    const beforeMiddlewares = this.middlewares?.deleteOne?.before || []

    this.router.delete(this.mainRouteWithId, [...beforeMiddlewares, callback])
  }

  /**
   *
   */
  private buildBulkDeleteRoute() {
    const callback = AsyncWrapper(async (req, res) => {
      const response = await this.service.deleteBulk(req.parsedQuery)
      return res.status(200).json({ count: response })
    })

    const beforeMiddlewares = this.middlewares?.deleteBulk?.before || []

    this.router.delete(this.mainRouteWithBulk, [...beforeMiddlewares, this.getQueryParserMiddleware(), callback])
  }

  /**
   *
   */
  private getQueryParserMiddleware(body = false) {
    const middleware = AsyncWrapper(async (req, res, next) => {
      const toBeParsed = body ? req.body : req.query

      req.parsedQuery = new QueryParser(toBeParsed, this.service.model, { body })
      return next()
    })

    return middleware
  }

  /**
   *
   * @param routeName
   */
  private setRouteName(routeName?: string): void {
    this.routeName = routeName || pluralize.plural(this.service.modelName).toLowerCase()
  }

  /**
   * Create route string from model name
   * Useful for GET / POST methods
   */
  private get mainRoute() {
    return '/' + this.routeName
  }

  /**
   * Create subroute string with id param from mainRoute
   * Useful for GET / PUT / DELETE methods
   */
  private get mainRouteWithId() {
    return this.mainRoute + '/:id'
  }

  /**
   * Create subroute string with id param from mainRoute
   * Useful for GET / PUT / DELETE methods
   */
  private get mainRouteWithBulk() {
    return this.mainRoute + '/bulk'
  }

  private get mainRouteWithQuery() {
    return this.mainRoute + '/query'
  }

  private get mainRouteWithQueryCount() {
    return this.mainRoute + '/query/count'
  }

  /**
   * Create subroute string with count from mainRoute
   * Useful for GET method
   */
  private get mainRouteWithCount() {
    return this.mainRoute + '/count'
  }
}
