import { app } from '../../src'
import { Application } from 'express'

const getUser = (id: string) => {
  return { lastname: 'DOE', firstname: 'John', id }
}

const options = {
  subPath: 'test/mocks',
  passport: {
    getUser,
    secret: 'abc'
  },
  debug: false
}

export const startServer = async (): Promise<Application> => {
  const express = await app.initNativeApp(options)
  return express
}
