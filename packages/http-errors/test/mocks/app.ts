import * as express from 'express'
import { HttpError, errorsMiddleware } from '../../src/http-errors'

const app = express()

const carsHandler = (req: express.Request, res: express.Response) => {
  res.status(200).json([{ name: 'RENAULT' }, { name: 'ASTON MARTIN' }, { name: 'BMW' }])
}

const notFoundHandler = (req: express.Request, res: express.Response) => {
  throw HttpError.NotFound()
}

const anyErrorHandler = (req: express.Request, res: express.Response) => {
  try {
    throw new Error('Some error message')
  } catch (error) {
    throw HttpError.NotAcceptable({ error, errorCode: 1 })
  }
}

app.get('/cars', carsHandler)
app.get('/notfound', notFoundHandler)
app.get('/notacceptable', anyErrorHandler)

app.use(errorsMiddleware())

const appWithDebug = express()

appWithDebug.get('/cars', carsHandler)
appWithDebug.get('/notfound', notFoundHandler)
appWithDebug.get('/notacceptable', anyErrorHandler)

appWithDebug.use(errorsMiddleware({ debugServer: true, debugClient: true }))

export { app, appWithDebug }
