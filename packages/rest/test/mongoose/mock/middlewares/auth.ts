import HttpError from '../../../../src/http-error'
import { AsyncWrapper } from '../../../../src/utils'

export default AsyncWrapper(async (req, res, next) => {
  const { authorization } = req.headers

  // When token is not passed
  if (!authorization) throw HttpError.Unauthorized()

  // When token is not authorized to access to the ressource
  if (authorization !== 'abc') throw HttpError.Forbidden()

  return next()
})
