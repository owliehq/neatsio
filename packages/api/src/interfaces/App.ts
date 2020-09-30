import { RequestHandler } from 'express'
import { Strategy } from 'passport'

export interface InitAppNativeOptions {
  passportStrategies?: Array<Strategy>
  debug?: boolean
  acl?: {
    roleCallback?: Function
  }
  tsEnv?: boolean
  port?: number
  useBeforeMiddlewares?: Array<RequestHandler>
}
