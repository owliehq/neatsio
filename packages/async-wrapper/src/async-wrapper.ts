import { Request, Response, NextFunction, RequestHandler } from 'express'

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>

export const asyncWrapper = (handler: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next)
  }
}
