import { Strategy } from 'passport'

export interface InitAppNativeOptions {
  passportStrategies?: Array<Strategy>
  debug?: boolean
  acl?: {
    roleCallback?: Function
  }
}
