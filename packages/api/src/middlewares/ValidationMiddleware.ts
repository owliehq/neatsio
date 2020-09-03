import { validationResult, matchedData } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const validationMiddleware = (validations: any) => {
  const promise = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation: any) => validation.run(req)))

    const errors = validationResult(req)

    if (errors.isEmpty()) {
      req.body = matchedData(req, { locations: ['body'] })
      return next()
    }

    const result = errors.array().map((error: any) => {
      return {
        message: `Field '${error.param}' is invalid or missing.`,
        field: error.param
      }
    })

    const message = `There's error(s) on param(s).`

    res.status(422).json({ statusCode: 422, message, errors: result })
  }

  return promise
}
