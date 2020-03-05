import * as express from 'express'
import * as bodyParser from 'body-parser'
import { HttpError, errorsMiddleware } from '@owliehq/http-errors'

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
  },
  routes: [
    {
      method: 'GET',
      path: '/:id/download',
      execute: uploader.buildDownloadEndpoint({
        filename: 'image.png',
        async retrieveKeyCallback(id) {
          const file = await File.findByPk(id)

          if (!file) throw HttpError.NotFound()

          return file.key
        }
      })
    }
  ]
})

app.use('/', neatsio.routes)

app.use(errorsMiddleware)

export default app
