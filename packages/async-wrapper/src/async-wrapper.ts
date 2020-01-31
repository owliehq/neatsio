import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 *
 * @param fn
 */
export default function asyncWrapper(fn: RequestHandler) {
  return function(req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next)
  }
}
