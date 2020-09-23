export * from './decorators'
export * from './middlewares'
export * from './interfaces/NeatsioActions'
export * from './interfaces/App'
export * from './RightsManager'
export * from './app'

import { App } from './app'

export const app = new App()
