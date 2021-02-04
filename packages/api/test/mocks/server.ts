import { app, InitAppNativeOptions } from '../../src'
import { Application } from 'express'
import { tokenStrategy } from './config/passport'

const options: InitAppNativeOptions = {
  passportStrategies: [tokenStrategy],
  acl: {
    roleCallback: async (user: any) => {
      return user.role
    }
  },
  debug: false,
  tsEnv: __filename.endsWith('ts')
}

export const startServer = async (): Promise<Application> => {
  const express = await app.initNativeApp(options)
  return express
}
