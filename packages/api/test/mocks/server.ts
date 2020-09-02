import { app, InitAppNativeOptions } from '../../src'
import { Application } from 'express'
import { tokenStrategy } from './config/passport'

const options: InitAppNativeOptions = {
  passportStrategies: [tokenStrategy]
}

export const startServer = async (): Promise<Application> => {
  const express = await app.initNativeApp(options)
  return express
}
