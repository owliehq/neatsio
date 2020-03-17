import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as process from 'process'

import { errorsMiddleware } from '@owliehq/http-errors'

export class App {
  /**
   *
   */
  private express: express.Application = express()

  /**
   *
   */
  private controllers: any[] = []

  /**
   *
   */
  private get commonMiddlewares() {
    return [bodyParser.json(), bodyParser.urlencoded({ extended: false })]
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
    this.express.use(this.commonMiddlewares)

    this.controllers.forEach((controller: any) => {
      this.express.use(controller.path, controller.router)
    })

    this.express.use(errorsMiddleware({ debugServer: true }))
    return this.express
  }

  /**
   *
   */
  public async loadControllers(subPath?: string) {
    if (this.controllers.length) throw new Error('Controllers are already set')

    /* istanbul ignore next */
    const srcPath = subPath || 'src'

    const promises = fs
      .readdirSync(path.resolve(process.cwd(), srcPath, 'controllers'))
      .map((file: string) => import(path.resolve(process.cwd(), srcPath, 'controllers', file)))

    return Promise.all(promises)
  }

  /**
   *
   * @param options
   */
  public async initNativeApp(options?: any): Promise<express.Application> {
    await this.loadControllers(options?.subPath)
    return this.native
  }

  /**
   *
   */
  /* istanbul ignore next */
  public async start(options?: any) {
    await this.loadControllers()

    this.native.listen(3000, () => {
      console.log('server is up')
    })
  }
}
