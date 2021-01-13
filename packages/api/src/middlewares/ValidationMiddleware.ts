import { validationResult, matchedData } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { asyncWrapper } from '@owliehq/async-wrapper'

export const validationMiddleware = (validations: any) => {
  const handler = async (req: Request, res: Response, next: NextFunction) => {
    const runValidationPromises = validations.map((validation: any) => validation.run(req))

    await Promise.all(runValidationPromises)

    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const data = matchedData(req, { locations: ['body'] })
      
      // Handle object value from matchedData
      // See issue: https://github.com/express-validator/express-validator/issues/915
      req.body = Array.isArray(req.body) ? Object.values(data) : data
      return next()
    }

    const result = errors.array().map((error: any) => {
      return {
        message: error.msg || `Field '${error.param}' is invalid or missing.`,
        field: error.param
      }
    })

    const message = `There's error(s) on param(s).`

    res.status(422).json({ statusCode: 422, message, errors: result })
  }

  return asyncWrapper(handler)
}
