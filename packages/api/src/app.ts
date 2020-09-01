import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as path from 'path'
import * as passport from 'passport'
import * as glob from 'glob'

import { JwtPassportStrategy } from './config/passport'

import { errorsMiddleware } from '@owliehq/http-errors'

// WTF require is needed...
const neatsio = require('@owliehq/neatsio')

export class App {
  /**
   *
   */
  private controllers: any[] = []

  /**
   *
   */
  private get commonMiddlewares() {
    return [bodyParser.json(), bodyParser.urlencoded({ extended: false }), passport.initialize()]
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

    this.controllers.forEach((controller: any) => {
      app.use(controller.path, controller.router)
    })

    app.use(neatsio.routes)

    app.use(errorsMiddleware({ debugServer: false }))

    app.use((req, res) => {
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
  public async loadControllers(subPath?: string) {
    if (this.controllers.length) throw new Error('Controllers already set')

    const promises = glob
      .sync('**/*Controller.*', { absolute: true, ignore: '**/node_modules/**' })
      .map((file: string) => import(path.resolve(file)))

    return Promise.all(promises)
  }

  /**
   *
   * @param options
   */
  public async initNativeApp(options?: any): Promise<express.Application> {
    this.reset()
    passport.use(JwtPassportStrategy(options.passport))
    await this.loadControllers(options?.subPath)
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
  public async start(options?: any) {
    const app = await this.initNativeApp(options)

    app.listen(3000, () => {
      console.log('server is up')
    })
  }
}
