import { Op, fn, col, where } from 'sequelize'
import * as pluralize from 'pluralize'
import * as dot from 'dot-prop'

import HttpError from './http-error'
import { isPlainObject, normalizePath, deconstructPath } from './utils'

/**
 *
 */
export default class QueryParser {
  private conditions?: any
  private limit?: any
  private skip?: any
  private sort?: any
  private select?: any
  private populate?: any

  private models?: any

  constructor(query: any, models?: any) {
    this.parseConditions(query.$conditions)
    this.parseSelect(query.$select)
    this.parseLimit(query.$limit)
    this.parseSkip(query.$skip)
    this.parseSort(query.$sort)
    this.parsePopulate(query.$populate)

    this.models = models ? models : []
  }

  /**
   *
   */
  public toMongooseParams(): IMongooseParsedParameters {
    const params: IMongooseParsedParameters = {
      conditions: {},
      options: {}
    }

    if (this.select) params.select = this.select
    if (this.conditions) params.conditions = this.conditions
    if (this.limit) params.options.limit = this.limit
    if (this.skip) params.options.skip = this.skip
    if (this.sort) params.options.sort = this.sort
    if (this.populate) params.populate = this.populate

    return params
  }

  /**
   *
   */
  public toSequelizeParams(): ISequelizeParsedParameters {
    const params: ISequelizeParsedParameters = {
      order: []
    }

    if (this.select) params.attributes = this.convertSelectToSequelize()
    if (this.conditions) params.where = this.convertConditionsToSequelize()
    if (this.limit) params.limit = this.limit
    if (this.skip) params.offset = this.skip
    if (this.sort) params.order = this.convertSortToSequelize()
    if (this.populate) params.include = this.convertPopulateToSequelize()

    return params
  }

  /**
   *
   * @param conditions
   */
  /*public mergeConditions(conditions: any) {
    this.conditions = { ...this.conditions, ...conditions }
  }*/

  /**
   *
   * @param conditions
   */
  private parseConditions(conditions: any) {
    try {
      this.conditions = conditions ? JSON.parse(conditions) : {}
    } catch (err) {
      throw HttpError.BadRequest()
    }
  }

  /**
   *
   * @param select
   */
  private parseSelect(select?: string) {
    if (!select) return
    this.select = select
  }

  /**
   *
   * @param sort
   */
  private parseSort(sort?: string) {
    if (!sort) return
    this.sort = sort
  }

  /**
   *
   * @param limit
   */
  private parseLimit(limit?: string) {
    if (!limit) return
    this.limit = parseInt(limit, 10)
  }

  /**
   *
   * @param skip
   */
  private parseSkip(skip?: string) {
    if (!skip) return
    this.skip = parseInt(skip, 10)
  }

  /**
   *
   * @param populate
   */
  private parsePopulate(populate?: string) {
    if (!populate) return
    this.populate = populate
  }

  /**
   *
   */
  private convertConditionsToSequelize() {
    const sequelizeOperators: any = {
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $in: Op.in,
      $nin: Op.notIn,
      $like: Op.like,
      $notLike: Op.notLike,
      $iLike: Op.iLike,
      $notILike: Op.notILike,
      $or: Op.or,
      $and: Op.and
    }

    /**
     *
     * @param conditions
     */
    const convert = (conditions: any): any => {
      //
      if (Array.isArray(conditions)) return conditions.map(convert)

      //
      if (!isPlainObject(conditions)) return conditions

      //
      const converted = Object.keys(conditions).reduce((result: any, prop) => {
        const value = conditions[prop]
        const key = sequelizeOperators[prop] || prop

        if (value.hasOwnProperty('$near')) {
          const nearParams = value.$near

          const radius = nearParams.radius || 10

          if (nearParams.lat && nearParams.lng) {
            const within = fn(
              'ST_DWithin',
              col(key),
              fn('ST_GeometryFromText', `POINT(${nearParams.lat} ${nearParams.lng})`),
              radius
            )

            // @ts-ignore
            result[Op.and] = where(within, true)
          }

          return result
        }

        result[key] = convert(value)

        return result
      }, {})

      return converted
    }

    return convert(this.conditions)
  }

  /**
   *
   */
  private convertSelectToSequelize() {
    return this.select.split(' ')
  }

  /**
   *
   */
  private convertSortToSequelize() {
    const fields = this.sort.split(' ')

    //
    return fields.map((field: string) => {
      const order = field.startsWith('-') ? 'DESC' : 'ASC'
      return order === 'DESC' ? [field.substring(1), order] : [field, order]
    })
  }

  /**
   *
   */
  private convertPopulateToSequelize() {
    const paths = normalizePath(deconstructPath(this.populate.split(' ')))
    const treePaths = {}

    paths.forEach(path => dot.set(treePaths, path, true))

    const toIncludePropertyRecursive = (tree: any): any => {
      return Object.keys(tree).map(entry => {
        const modelName = pluralize.singular(entry)
        const model = this.models[modelName]

        return tree[entry] === true
          ? { model }
          : {
              model,
              include: toIncludePropertyRecursive(tree[entry])
            }
      })
    }

    return toIncludePropertyRecursive(treePaths)
  }
}

/**
 *
 */
export interface IMongooseParsedParameters {
  conditions: { [key: string]: any }
  select?: string
  options: {
    sort?: string
    limit?: number
    skip?: number
  }
  populate?: string
}

/**
 *
 */
export interface ISequelizeParsedParameters {
  attributes?: Array<string>
  where?: { [key: string]: any }
  order: Array<any>
  limit?: number
  offset?: number
  include?: Array<any>
}
