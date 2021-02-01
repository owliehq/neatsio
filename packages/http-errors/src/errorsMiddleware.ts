import { ErrorRequestHandler } from 'express'
import { HttpError } from './HttpError'

/**
 *
 */
export const errorsMiddleware = (options?: any) => {
  // Default options
  options = options || {
    debugServer: false,
    debugClient: false,
    skipClientError: false
  }

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    err = err.defaultHttpClassError || err

    const statusCode = err.statusCode || 500

    if (options.debugServer && ((!options.skipClientError && statusCode < 500) || statusCode >= 500)) console.error(err)
    if (statusCode === 500) err = HttpError.InternalServerError()

    const { message, defaultHttpClassError } = err

    const stack = options.debugClient ? err.stack : undefined
    const errorCode = err.errorCode ? 'E' + err.errorCode.toString().padStart(5, '0') : undefined
    const details = err.details || undefined

    res.status(statusCode).json({
      statusCode,
      errorCode,
      message,
      details,
      stack
    })
  }

  return errorHandler
}
