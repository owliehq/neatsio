/**
 *
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any,
    public errorCode?: number,
    public parentError?: Error
  ) {
    super(message)

    if (parentError) this.stack = parentError.stack
  }

  /**
   * Factory of
   * HTTP Error 400 Bad Request
   */
  public static BadRequest(options?: OptionsErrorFactory) {
    return prepareHttpError(400, 'Bad Request', options)
  }

  /**
   * Factory of
   * HTTP Error 401 Not Found
   */
  public static Unauthorized(options?: OptionsErrorFactory) {
    return prepareHttpError(401, 'Unauthorized', options)
  }

  /**
   * Factory of
   * HTTP Error 402 PaymentRequired
   */
  public static PaymentRequired(options?: OptionsErrorFactory) {
    return prepareHttpError(402, 'Payment Required', options)
  }

  /**
   * Factory of
   * HTTP Error 403 Forbidden
   */
  public static Forbidden(options?: OptionsErrorFactory) {
    return prepareHttpError(403, 'Forbidden', options)
  }

  /**
   * Factory of
   * HTTP Error 404 Not Found
   */
  public static NotFound(options?: OptionsErrorFactory) {
    return prepareHttpError(404, 'Not Found', options)
  }

  /**
   * Factory of
   * HTTP Error 405 Method Not Allowed
   */
  public static MethodNotAllowed(options?: OptionsErrorFactory) {
    return prepareHttpError(405, 'Method Not Allowed', options)
  }

  /**
   * Factory of
   * HTTP Error 406 Not Acceptable
   */
  public static NotAcceptable(options?: OptionsErrorFactory) {
    return prepareHttpError(406, 'Not Acceptable', options)
  }

  /**
   * Factory of
   * HTTP Error 409 Conflict
   */
  public static Conflict(options?: OptionsErrorFactory) {
    return prepareHttpError(409, 'Conflict', options)
  }

  /**
   * Factory of
   * HTTP Error 410 Gone
   */
  public static Gone(options?: OptionsErrorFactory) {
    return prepareHttpError(410, 'Gone', options)
  }

  /**
   * Factory of
   * HTTP Error 422 Unprocessable Entity
   */
  public static UnprocessableEntity(options?: OptionsErrorFactory) {
    return prepareHttpError(422, 'Unprocessable Entity', options)
  }

  /**
   * Factory of
   * HTTP Error 423 Locked
   */
  public static Locked(options?: OptionsErrorFactory) {
    return prepareHttpError(423, 'Locked', options)
  }

  /**
   * Factory of
   * HTTP Error 500 Internal Server Error
   */
  public static InternalServerError(options?: OptionsErrorFactory) {
    return prepareHttpError(500, 'Internal Server Error', options)
  }
}

/**
 *
 * @param statusCode
 * @param defaultMessage
 * @param options
 */
function prepareHttpError(statusCode: number, defaultMessage: string, options: OptionsErrorFactory) {
  if (typeof options === 'string' || !options) return new HttpError(statusCode, options || defaultMessage)
  return new HttpError(statusCode, options.message || defaultMessage, options.details, options.errorCode, options.error)
}

export interface OptionsErrorFactoryObject {
  message?: string
  error?: Error
  details?: any
  errorCode?: number
}

export type OptionsErrorFactory = OptionsErrorFactoryObject | string | undefined
