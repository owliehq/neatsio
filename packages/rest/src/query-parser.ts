import { HttpError } from '@owliehq/http-errors'
import { SequelizeConverter, ISequelizeParsedParameters } from './converters'
import { ParsedQuery } from './converters/converter'

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

  constructor(query: any, private model: any, private options?: any) {
    this.parseConditions(query.$conditions)
    this.parseSelect(query.$select)
    this.parseLimit(query.$limit)
    this.parseSkip(query.$skip)
    this.parseSort(query.$sort)
    this.parsePopulate(query.$populate)
  }

  /**
   *
   */
  private get queryParsed(): ParsedQuery {
    const { select, conditions, limit, skip, sort, populate } = this
    return { select, conditions, limit, skip, sort, populate }
  }

  /**
   *
   */
  public toMongooseParams(): IMongooseParsedParameters {
    // TODO: make to converter!

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
    return SequelizeConverter.convert(this.queryParsed, this.model, this.options)
  }

  /**
   *
   * @param conditions
   */
  private parseConditions(conditions: any) {
    try {
      this.conditions = conditions ? JSON.parse(conditions) : {}
    } catch (err) {
      throw HttpError.BadRequest('Malformatted JSON')
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
