import { AbstractError, HttpError } from '../../src'

export class CustomTestError extends AbstractError {
  public code: number = 150

  public defaultHttpClassError: HttpError = HttpError.Unauthorized({
    message: this.message,
    errorCode: this.code
  })
}
