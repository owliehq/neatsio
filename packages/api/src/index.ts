export * from './decorators'
export * from './middlewares'

import { App } from './app'

export const app: App = new App()

/*declare global {
  namespace Express {
    export interface Request {
      user: any
    }
  }
}*/
