import { AbstractError, CanThrowHttpError } from './AbstractError'
import { HttpError } from './HttpError'

/**
 *
 */
export class NotFoundError extends AbstractError implements CanThrowHttpError {
  public code: number = 100

  public defaultHttpClassError: HttpError = HttpError.NotFound({
    message: this.message,
    errorCode: this.code
  })

  constructor(resource: string) {
    super(`No ${resource} found in database.`)
  }
}
