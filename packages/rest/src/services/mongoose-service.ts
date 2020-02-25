import { Model } from 'mongoose'

import { HttpError } from '@owliehq/http-errors'
import Service from '../service'
import QueryParser from '../query-parser'

export default class MongooseService extends Service {
  public readonly model: Model<any>

  /**
   *
   * @param model
   */
  public constructor(model: Model<any>) {
    super()
    this.model = model
  }

  /**
   *
   * @param id
   */
  public async findById(id: string, queryParser?: QueryParser) {
    let query = this.model.findById(id)

    if (queryParser) {
      const { populate } = queryParser.toMongooseParams()
      // @ts-ignore
      query = populate ? query.deepPopulate(populate) : query
    }

    const result = await query.exec()

    if (!result) throw HttpError.NotFound()

    return result
  }

  /**
   *
   */
  public async find(queryParser: QueryParser) {
    const { conditions, select, options, populate } = queryParser.toMongooseParams()

    let query = this.model.find(conditions, select, options)

    // @ts-ignore
    query = populate ? query.deepPopulate(populate) : query

    try {
      const result = await query.exec()
      return result
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  /**
   *
   * @param queryParser
   */
  public async count(queryParser: QueryParser) {
    throw new Error('Not implemented')
  }

  /**
   *
   * @param body
   */
  public async createOne(body: any) {
    const created = await this.model.create(body)
    return created
  }

  /**
   *
   * @param id
   * @param body
   */
  public async updateOne(id: string, body: any) {
    await this.model.updateOne({ _id: id }, body)
    const updated = await this.findById(id)
    return updated
  }

  /**
   *
   * @param body
   */
  createBulk(body: any): Promise<any> {
    throw new Error('Method not implemented.')
  }

  /**
   *
   * @param body
   * @param query
   */
  updateBulk(body: any, query?: any): Promise<any> {
    throw new Error('Method not implemented.')
  }

  /**
   *
   * @param attributes
   */
  setHiddenAttributes(attributes: any): void {
    this.hiddenAttributes = attributes
  }

  /**
   *
   * @param id
   */
  public async deleteOne(id: string): Promise<any> {
    await this.model.deleteOne({ _id: id })
    return { deletedAt: new Date() }
  }

  /**
   *
   * @param query
   */
  public async deleteBulk(query?: QueryParser | undefined): Promise<any> {
    throw new Error('Method not implemented.')
  }

  /**
   *
   * @param model
   */
  protected removeHiddenAttributesFromEntity(model: any) {
    return model
  }

  /**
   *
   */
  public get associations() {
    // TODO
    return []
  }

  /**
   *
   */
  public get modelName() {
    return this.model.modelName.toLowerCase()
  }
}
