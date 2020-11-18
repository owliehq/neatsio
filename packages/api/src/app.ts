import { Application, Request, Response, NextFunction, RequestHandler } from 'express'
import * as bodyParser from 'body-parser'
import * as path from 'path'
import * as passport from 'passport'
import * as glob from 'fast-glob'

import { errorsMiddleware } from '@owliehq/http-errors'
import { Strategy } from 'passport'
import { RightsManager } from './RightsManager'
import { InitAppNativeOptions } from './interfaces/App'

// WTF require is needed...
const neatsio = require('@owliehq/neatsio')
const cors = require('cors')
const express = require('express')

export class App {
  /**
   *
   */
  private controllers: any[] = []

  /**
   *
   */
  private beforeMiddlewares: RequestHandler[] = []

  /**
   *
   */
  private get commonMiddlewares() {
    return [
      cors({ origin: true }),
      bodyParser.json(),
      bodyParser.urlencoded({ extended: false }),
      passport.initialize(),
      (req: Request, res: Response, next: NextFunction) => {
        res.removeHeader('X-Powered-By')
        next()
      }
    ]
  }

  /**
   *
   * @param controller
   */
  public registerController(controller: any) {
    this.controllers.push(controller)
  }

  /**
   *
   */
  public get native() {
    const app = express()

    app.use(this.commonMiddlewares)

    if (this.beforeMiddlewares.length) app.use(this.beforeMiddlewares)

    this.controllers.forEach((controller: any) => {
      app.use(controller.path, controller.router)
    })

    app.use(neatsio.routes)

    app.use(errorsMiddleware({ debugServer: true, skipClientError: true }))

    app.use((req: Request, res: Response) => {
      res.status(404).json({
        message: 'Not found.',
        statusCode: 404
      })
    })

    return app
  }

  /**
   *
   */
  public async loadControllers(options: any = {}) {
    if (this.controllers.length) throw new Error('Controllers already set')

    //
    const extension = options.tsEnv ? 'ts' : 'js'

    const controllerFound = glob.sync(`**/*Controller.${extension}`, {
      absolute: true,
      deep: 5,
      ignore: ['**/node_modules/**']
    })

    console.log(`${controllerFound.length} controllers found! Importing now...`)

    const promises = controllerFound.map((file: string) => {
      return import(path.resolve(file)).then(() => {
        const [controllerName] = file.split('/').slice(-1)
        console.log(`${controllerName.slice(0, -3)} has been successfully loaded.`)
      })
    })

    console.log(process.cwd())

    return Promise.all(promises)
  }

  /**
   *
   * @param beforeMiddlewares
   * @param afterMiddlewares
   */
  private loadMiddlewares(beforeMiddlewares: Array<RequestHandler> = [], afterMiddlewares = []) {
    this.beforeMiddlewares = beforeMiddlewares
  }

  /**
   *
   * @param options
   */
  public async initNativeApp(options: InitAppNativeOptions): Promise<Application> {
    this.reset()

    if (options.passportStrategies) {
      if (!options.passportStrategies.length) throw new Error('Passport needs at least one effective strategy')

      options.passportStrategies.forEach((strategy: Strategy) => passport.use(strategy))
    }

    if (options.acl) {
      if (options.acl.roleCallback) {
        RightsManager.roleCallback = options.acl.roleCallback
      }
    }

    if (options.useBeforeMiddlewares) {
      this.loadMiddlewares(options.useBeforeMiddlewares)
    }

    const loadControllersOptions = {
      tsEnv: options.tsEnv
    }

    //
    await this.loadControllers(loadControllersOptions)

    //
    RightsManager.applyRights()

    return this.native
  }

  /**
   *
   */
  public reset() {
    this.controllers = []
  }

  /**
   *
   */
  /* istanbul ignore next */
  public async start(options: InitAppNativeOptions = {}) {
    const app = await this.initNativeApp(options)

    return new Promise((resolve, reject) => {
      try {
        app.listen(options?.port || 3000, () => {
          resolve()
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}
