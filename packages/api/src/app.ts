import * as express from 'express'
import * as bodyParser from 'body-parser'

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

  /* istanbul ignore next */
  public start() {
    this.native.listen(3000, () => {
      console.log('server is up')
    })
  }
}
