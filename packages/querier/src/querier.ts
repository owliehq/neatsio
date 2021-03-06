import * as qs from 'query-string'

import { cleanObject } from './utils'

/**
 *
 */
export class Querier {
  private baseUrl?: string
  private encode: boolean = false
  private stringify: boolean = true
  private body: boolean = false

  private $select: Array<string> = []
  private $conditions: any = {}
  private $limit?: number
  private $skip?: number
  private $sort: Array<string> = []
  private $populate: Array<string> = []

  constructor(options?: QuerierOptions) {
    if (options?.body) this.body = options.body

    if (options?.baseUrl) this.baseUrl = options.baseUrl
    if (options?.encode) this.encode = options.encode
    if (options?.resultsPerPage) this.$limit = options.resultsPerPage
    if (options?.stringify === false) this.stringify = options.stringify
  }

  /**
   *
   * @param input
   */
  public select(input: string): Querier {
    this.$select = this.$select.filter(x => x !== `-${input}`)
    if (!this.$select.includes(input)) this.$select.push(input)
    return this
  }

  /**
   *
   * @param input
   */
  public unselect(input: string): Querier {
    this.$select = this.$select.filter(x => x !== input)
    this.$select.push(`-${input}`)
    return this
  }

  /**
   *
   * @param input
   */
  public rawConditions(input: any): Querier {
    if (Object.keys(this.$conditions).length) throw new Error(`Conditions are already declared!`)
    this.$conditions = input
    return this
  }

  /**
   *
   * @param input
   */
  public page(input: number): Querier {
    this.$limit = this.$limit || 10
    this.$skip = (input - 1) * this.$limit
    return this
  }

  /**
   *
   * @param input
   */
  public limit(input: number): Querier {
    this.$limit = input
    return this
  }

  /**
   *
   * @param input
   */
  public skip(input: number): Querier {
    this.$skip = input
    return this
  }

  /**
   *
   * @param input
   */
  public sort(input: string): Querier {
    this.$sort.push(input)
    return this
  }

  /**
   *
   * @param input
   */
  public sortDesc(input: string): Querier {
    this.$sort.push(`-${input}`)
    return this
  }

  /**
   *
   * @param input
   */
  public populate(input: string): Querier {
    this.$populate.push(input)
    return this
  }

  /**
   *
   */
  public generate(): any {
    const $select = this.cleanSelect()
    const $conditions = this.cleanConditions()
    const $skip = this.cleanSkip()
    const $limit = this.cleanLimit()
    const $sort = this.cleanSort()
    const $populate = this.cleanPopulate()

    const result = cleanObject({
      $select,
      $skip,
      $limit,
      $sort,
      $populate
    })

    if ($conditions) result.$conditions = $conditions

    return this.stringify && !this.body ? this.generateString(result) : result
  }

  /**
   *
   */
  private generateString(query: any) {
    query = Object.keys(query).reduce((result: any, key: string) => {
      const value = query[key]
      const type = typeof value

      result[key] = type === 'object' ? JSON.stringify(value) : value

      return result
    }, {})

    if (!Object.keys(query).length) return this.baseUrl || ''

    const stringified = qs.stringify(query, { encode: this.encode })

    return `${this.baseUrl || ''}?${stringified}`
  }

  /**
   *
   */
  private cleanPopulate(): string | undefined {
    return this.$populate.length ? this.$populate.join(' ') : undefined
  }

  /**
   *
   */
  private cleanSelect(): string | undefined {
    return this.$select.length ? this.$select.join(' ') : undefined
  }

  /**
   *
   */
  private cleanSkip(): number | undefined {
    return this.$skip
  }

  /**
   *
   */
  private cleanSort(): string | undefined {
    return this.$sort.length ? this.$sort.join(' ') : undefined
  }

  /**
   *
   */
  private cleanLimit(): number | undefined {
    return this.$limit
  }

  /**
   *
   */
  private cleanConditions(): any | undefined {
    return Object.keys(this.$conditions).length ? this.$conditions : undefined
  }

  /**
   *
   * @param options
   */
  public static query(options: QuerierOptions) {
    return new Querier(options)
  }

  /**
   *
   */
  public static bodyQuery(options: QuerierOptions) {
    options.body = true
    options.stringify = false
    options.encode = false

    return new Querier(options)
  }
}

export interface QuerierOptions {
  baseUrl?: string
  encode?: boolean
  stringify?: boolean
  resultsPerPage?: number
  body?: boolean
}
