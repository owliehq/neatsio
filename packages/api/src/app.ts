import * as express from 'express'
import { errorsMiddleware } from '@owliehq/http-errors'

export class App {
  express: express.Application

  constructor() {
    this.express = express()
  }

  /**
   *
   * @param controller
   */
  public registerController(controller: any) {
    this.express.use(controller.path, controller.router)
  }

  /**
   *
   */
  public get native() {
    return this.express
  }

  /**
   *
   */
  public start() {
    this.express.listen(3000, () => {
      console.log('server is up')
    })
  }
}
