import QueryParser from './query-parser'

export default abstract class Service {
  public readonly model: any

  /**
   *
   * @param id
   * @param query
   */
  abstract async findById(id: string, query?: any): Promise<any>

  /**
   *
   */
  abstract async find(query: QueryParser): Promise<any>

  /**
   *
   * @param body
   */
  abstract async createOne(body: any): Promise<any>

  /**
   *
   * @param body
   */
  abstract async createBulk(body: any): Promise<any>

  /**
   *
   * @param body
   */
  abstract async updateOne(id: string, body: any): Promise<any>

  /**
   *
   * @param body
   * @param query
   */
  abstract async updateBulk(body: any, query?: QueryParser): Promise<any>

  /**
   *
   * @param id
   */
  abstract async deleteOne(id: string): Promise<any>

  /**
   *
   */
  abstract get associations(): Array<any>

  /**
   *
   */
  abstract get modelName(): string
}
