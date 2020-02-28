import { Op, fn, col, where, Model } from 'sequelize'
import * as pluralize from 'pluralize'
import * as dot from 'dot-prop'
import { isPlainObject, normalizePath, deconstructPath } from '../utils'
import { Converter, ParsedQuery } from './converter'
import currentOrchestrator from '../neatsio-rest'

export class SequelizeConverter extends Converter {
  /**
   *
   */
  private specialSort: any[] = []

  /**
   *
   * @param query
   */
  constructor(query: ParsedQuery, private model: { new (): Model } & typeof Model) {
    super(query)
  }

  /**
   *
   */
  public toParams(options: any): ISequelizeParsedParameters {
    const params: ISequelizeParsedParameters = {
      order: []
    }

    params.attributes = this.convertSelect()
    if (this.conditions) params.where = this.convertConditions(options?.inverseLngLat)
    if (this.limit) params.limit = this.limit
    if (this.skip) params.offset = this.skip
    if (this.sort || this.specialSort.length) params.order = this.convertSort()
    if (this.populate) params.include = this.convertPopulate()

    return params
  }

  /**
   *
   */
  private convertSelect() {
    const selection = this.select?.length ? this.select.split(' ') : []

    const currentModel = this.model

    let attributes = undefined

    if (currentModel) {
      const { hiddenAttributes } = currentOrchestrator.servicesOptions[currentModel.name.toLowerCase()]

      const currentAttributes = Object.keys(currentModel.rawAttributes)

      attributes = currentAttributes
        .filter(x => !hiddenAttributes.includes(x))
        .concat(hiddenAttributes.filter((x: any) => !currentAttributes.includes(x)))

      if (selection.length) attributes = attributes.filter(x => selection.includes(x))
    }

    return attributes
  }

  /**
   *
   */
  private convertSort() {
    const fields = this.sort ? this.sort.split(' ') : []

    //
    return [
      ...fields.map((field: string) => {
        const order = field.startsWith('-') ? 'DESC' : 'ASC'
        return order === 'DESC' ? [field.substring(1), order] : [field, order]
      }),
      ...this.specialSort
    ]
  }

  /**
   *
   */
  private convertConditions(options: any) {
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
      $and: Op.and,

      // TODO: verify we are in Postgre env
      $contains: Op.contains,
      $contained: Op.contained,
      $overlap: Op.overlap,
      $any: Op.any
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

        //
        if (value === undefined) throw new Error('NO UNDEFINED VALUE')

        //
        if (value === null) {
          result[key] = null
          return result
        }

        //
        if (value.hasOwnProperty('$near')) {
          const nearParams = value.$near

          const radius = nearParams.radius || 10

          if (nearParams.lat && nearParams.lng) {
            const point = options?.inverseLngLat
              ? `POINT(${nearParams.lat} ${nearParams.lng})`
              : `POINT(${nearParams.lng} ${nearParams.lat})`

            const within = fn(
              'ST_DWithin',
              col(`${this.model.tableName}.${key}`),
              fn('ST_GeometryFromText', point),
              radius
            )

            // @ts-ignore
            result[Op.and] = where(within, true)

            const order = [
              fn('ST_Distance', col(`${this.model.tableName}.${key}`), fn('ST_GeometryFromText', point)),
              'ASC'
            ]

            this.specialSort.push(order)
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
  private convertPopulate() {
    const paths = normalizePath(deconstructPath(this.populate.split(' '))).filter(path => path.split('.').length < 5)
    const treePaths = {}

    paths.forEach(path => dot.set(treePaths, path, true))

    const toIncludePropertyRecursive = (tree: any, modelCheck: any): any => {
      const currentModel = modelCheck as { new (): Model } & typeof Model

      return Object.keys(tree).map(entry => {
        let extractedModel: typeof Model | undefined

        for (let [attribute, association] of Object.entries(currentModel.associations)) {
          if (pluralize.singular(attribute) === pluralize.singular(entry)) {
            extractedModel = association.target
            break
          }
        }

        //
        const model = extractedModel

        let attributes = undefined

        if (model) {
          const { hiddenAttributes } = currentOrchestrator.servicesOptions[model.name.toLowerCase()]

          const currentAttributes = Object.keys(model.rawAttributes)

          attributes = currentAttributes
            .filter(x => !hiddenAttributes.includes(x))
            .concat(hiddenAttributes.filter((x: any) => !currentAttributes.includes(x)))
        }

        return tree[entry] === true
          ? { model, as: entry, attributes }
          : {
              model,
              as: entry,
              include: toIncludePropertyRecursive(tree[entry], model),
              attributes
            }
      })
    }

    return toIncludePropertyRecursive(treePaths, this.model)
  }

  /**
   *
   */
  public static convert(
    query: ParsedQuery,
    model: { new (): Model } & typeof Model,
    options: any
  ): ISequelizeParsedParameters {
    const currentConvert = new this(query, model)
    return currentConvert.toParams(options)
  }
}

export interface ISequelizeParsedParameters {
  attributes?: Array<string>
  where?: { [key: string]: any }
  order: Array<any>
  limit?: number
  offset?: number
  include?: Array<any>
}
