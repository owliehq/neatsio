export * from './decorators'
export * from './middlewares'
export * from './interfaces/NeatsioActions'
export * from './interfaces/App'

export * from './RightsManager'

import { App } from './app'

export const app: App = new App()

/*declare global {
  namespace Express {
    export interface Request {
      user: any
    }
  }
}*/
