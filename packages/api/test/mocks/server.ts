import { app } from '../../src'
import { Application } from 'express'

export const startServer = async (): Promise<Application> => app.initNativeApp({ subPath: 'test/mocks' })
