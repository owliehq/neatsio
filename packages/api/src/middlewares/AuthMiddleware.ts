import * as passport from 'passport'
import { RequestHandler } from 'express'
import { HttpError } from '@owliehq/http-errors'

export const authMiddleware: RequestHandler = (req, res, next): void => {
  passport.authenticate('jwt', (err, user) => {
    if (err) return next(err)

    //
    if (!user)
      throw HttpError.Unauthorized({
        message: `Unauthorized Access, token must be provided.`,
        errorCode: 16
      })

    //
    //if (!user.active) throw HttpError.Unauthorized({ message: `Account desactivated.`, errorCode: 17 })

    req.user = user

    next()
  })(req, res, next)
}
