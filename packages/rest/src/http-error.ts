export default class HttpError {
  /**
   *
   */
  public statusCode: number

  /**
   *
   */
  public message: string

  /**
   *
   * @param status
   * @param message
   */
  public constructor(status: number, message: string) {
    this.statusCode = status
    this.message = message
  }

  /**
   * Factory of
   * HTTP Error 400 Bad Request
   */
  public static BadRequest(message?: string) {
    return new HttpError(400, message || 'Bad Request')
  }

  /**
   * Factory of
   * HTTP Error 401 Not Found
   */
  public static Unauthorized(message?: string) {
    return new HttpError(401, message || 'Unauthorized')
  }

  /**
   * Factory of
   * HTTP Error 403 Forbidden
   */
  public static Forbidden(message?: string) {
    return new HttpError(403, message || 'Forbidden')
  }

  /**
   * Factory of
   * HTTP Error 404 Not Found
   */
  public static NotFound(message?: string) {
    return new HttpError(404, message || 'Not found')
  }

  /**
   * Factory of
   * HTTP Error 500 Internal Server Error
   */
  public static InternalServerError(message?: string) {
    return new HttpError(500, message || 'Internal Server Error')
  }
}
