import * as path from 'path'
import * as fs from 'fs-extra'

import { app } from '../../src'
import { Application } from 'express'

const promises = fs
  .readdirSync(path.resolve(__dirname, 'controllers'))
  .map((file: string) => import(path.resolve(__dirname, 'controllers', file)))

export const startApp: () => Promise<Application> = async (): Promise<Application> => {
  return Promise.all(promises).then(() => {
    return app.native
  })
}
