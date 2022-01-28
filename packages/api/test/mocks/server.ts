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

export const startServer = async (port: number): Promise<Application> => {
  options.port = port
  const express = await app.initNativeApp(options)
  await app.start(options)
  return express
}
