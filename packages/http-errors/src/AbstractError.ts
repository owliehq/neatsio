import { CustomError } from 'ts-custom-error'
import { HttpError } from './HttpError'

/**
 *
 */
export abstract class AbstractError extends CustomError {
  public abstract code: number

  constructor(message: string) {
    super(message)
  }
}

/**
 *
 */
export interface CanThrowHttpError {
  defaultHttpClassError: HttpError
}
