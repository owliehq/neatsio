import * as path from 'path'
import * as fs from 'fs-extra'

import { app } from '../../src'

fs.readdirSync(path.resolve(__dirname, 'controllers')).forEach((file: string) =>
  import(path.resolve(__dirname, 'controllers', file)).then(controller => console.log(controller))
)

export default app.express
