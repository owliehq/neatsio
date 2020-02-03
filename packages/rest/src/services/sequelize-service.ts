import { Model } from 'sequelize'

import { HttpError } from '@owliehq/http-errors'
import Service from '../service'
import QueryParser from '../query-parser'

export default class SequelizeService<M extends Model> extends Service {
  public readonly model: { new (): M } & typeof Model

  /**
   *
   * @param model
   */
  public constructor(model: { new (): M } & typeof Model) {
    super()
    this.model = model
  }

  /**
   *
   * @param id
   */
  public async findById(id: string, query?: QueryParser) {
    let result

    if (query) {
      const { include } = query.toSequelizeParams()

      result = await this.model.findByPk(id, { include })
    } else {
      result = await this.model.findByPk(id)
    }

    if (!result) throw HttpError.NotFound()

    return result
  }

  /**
   *
   */
  public async find(query: QueryParser) {
    //
    const queryParams = query.toSequelizeParams()

    const { count, rows } = await this.model.findAndCountAll(queryParams)

    return rows
  }

  /**
   *
   */
  public async count(query: QueryParser) {
    const queryParams = query.toSequelizeParams()

    delete queryParams.attributes
    delete queryParams.include
    delete queryParams.limit
    delete queryParams.offset
    delete queryParams.order

    const result = await this.model.count(queryParams)

    return result
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
   * @param body
   */
  public async createBulk(body: any) {
    await this.model.bulkCreate(body)
  }

  /**
   * Update an entity by the primary key (mostly id)
   * @param body
   */
  public async updateOne(id: string, body: any) {
    const entityBeforeUpdate = await this.findById(id)

    const updated = await entityBeforeUpdate.update(body)
    return updated
  }

  /**
   * Update multiple entities by query
   * @param body
   * @param query
   */
  public async updateBulk(body: any, query: QueryParser) {
    const { where } = query.toSequelizeParams()

    const restriction = where ? { where } : { where: { 1: 1 } }

    await this.model.update(body, restriction)
  }

  /**
   *
   * @param attributes
   */
  public setHiddenAttributes(attributes: any): void {
    this.hiddenAttributes = attributes
  }

  /**
   *
   * @param id
   */
  public async deleteOne(id: string) {
    const entityBeforeDeletion = await this.findById(id)

    await entityBeforeDeletion.destroy()
  }

  /**
   *
   */
  public get associations(): Array<any> {
    return Object.values(this.model.associations)
      .filter(association => association.associationType === 'HasMany')
      .map(association => {
        return {
          model: association.target,
          foreignKey: association.foreignKey
        }
      })
  }

  /**
   *
   */
  public get modelName() {
    return this.model.name.toLowerCase()
  }
}
