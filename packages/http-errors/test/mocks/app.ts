import * as express from 'express'
import { HttpError, errorsMiddleware, NotFoundError } from '../../src'
import { CustomTestError } from './customError'

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
    throw HttpError.NotAcceptable({ error, errorCode: 1, details: { errors: ['error a', 'error b'] } })
  }
}

const customErrorHandler: express.RequestHandler = (req, res) => {
  throw new CustomTestError('custom error')
}

const notFoundCustomHandler: express.RequestHandler = (req, res) => {
  throw new NotFoundError('User')
}

app.get('/cars', carsHandler)
app.get('/notfound', notFoundHandler)
app.get('/notacceptable', anyErrorHandler)
app.get('/customerror', customErrorHandler)
app.get('/notfoundcustom', notFoundCustomHandler)

app.use(errorsMiddleware())

const appWithDebug = express()

appWithDebug.get('/cars', carsHandler)
appWithDebug.get('/notfound', notFoundHandler)
appWithDebug.get('/notacceptable', anyErrorHandler)

appWithDebug.use(errorsMiddleware({ debugServer: false, debugClient: true }))

export { app, appWithDebug }
