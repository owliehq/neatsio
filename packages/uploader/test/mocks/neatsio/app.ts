import * as express from 'express'
import * as bodyParser from 'body-parser'

const neatsio = require('@owliehq/neatsio')

import { uploader } from '../uploader'

import User from './models/user'
import File from './models/file'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

neatsio.registerModel(User)
neatsio.registerModel(File, {
  middlewares: {
    createOne: {
      before: [uploader.middleware]
    }
  }
})

app.use('/', neatsio.routes)

const errorMiddleware: express.ErrorRequestHandler = (err, req, res) => {
  console.error(err)
  res.send('FU')
}

app.use(errorMiddleware)

export default app
