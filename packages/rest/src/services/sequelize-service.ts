import { Model } from 'sequelize'

import HttpError from '../http-error'
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

      // tslint:disable-next-line: await-promise
      result = await this.model.findByPk(id, { include })
    } else {
      // tslint:disable-next-line: await-promise
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

    // tslint:disable-next-line: await-promise
    const { count, rows } = await this.model.findAndCountAll(queryParams)

    return rows
  }

  /**
   *
   * @param body
   */
  public async createOne(body: any) {
    // tslint:disable-next-line: await-promise
    const created = await this.model.create(body)
    return created
  }

  /**
   *
   * @param body
   */
  public async createBulk(body: any) {
    // tslint:disable-next-line: await-promise
    await this.model.bulkCreate(body)
  }

  /**
   * Update an entity by the primary key (mostly id)
   * @param body
   */
  public async updateOne(id: string, body: any) {
    const entityBeforeUpdate = await this.findById(id)

    // tslint:disable-next-line: await-promise
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

    // tslint:disable-next-line: await-promise
    await this.model.update(body, restriction)
  }

  /**
   *
   * @param id
   */
  public async deleteOne(id: string) {
    const entityBeforeDeletion = await this.findById(id)

    // tslint:disable-next-line: await-promise
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
