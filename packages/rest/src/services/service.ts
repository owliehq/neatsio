import QueryParser from '../query-parser'

export default abstract class Service {
  /**
   *
   */
  public readonly model: any

  /**
   *
   */
  public hiddenAttributes: any

  /**
   *
   * @param id
   * @param query
   */
  abstract findById(id: string, query?: QueryParser): Promise<any>

  /**
   *
   */
  abstract find(query?: QueryParser): Promise<any>

  /**
   *
   */
  abstract count(query?: QueryParser): Promise<any>

  /**
   *
   * @param body
   */
  abstract createOne(body: any, query?: QueryParser): Promise<any>

  /**
   *
   * @param body
   */
  abstract createBulk(body: any): Promise<any>

  /**
   *
   * @param body
   */
  abstract updateOne(id: string, body: any, query?: QueryParser): Promise<any>

  /**
   *
   * @param body
   * @param query
   */
  abstract updateBulk(body: any, query?: QueryParser): Promise<any>

  /**
   *
   * @param id
   */
  abstract deleteOne(id: string): Promise<any>

  /**
   *
   * @param query
   */
  abstract deleteBulk(query?: QueryParser): Promise<any>

  /**
   *
   * @param attributes
   */
  abstract setHiddenAttributes(attributes: any): void

  /**
   *
   * @param model
   */
  protected abstract removeHiddenAttributesFromEntity(model: any): any

  /**
   *
   */
  abstract get associations(): Array<any>

  /**
   *
   */
  abstract get modelName(): string
}
