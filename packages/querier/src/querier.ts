import * as qs from 'query-string'

const cleanObject = (obj: any) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') return cleanObject(obj[key])

    if (obj[key] === undefined) {
      delete obj[key]
      return
    }

    if (typeof obj[key] === 'string' && !obj[key].length) {
      delete obj[key]
      return
    }
  })

  return obj
}

/**
 *
 */
export class Querier {
  private baseUrl?: string
  private encode: boolean = false

  private $select: Array<string> = []
  private $conditions: any = {}
  private $limit?: number
  private $skip?: number
  private $sort: Array<string> = []

  constructor(options?: QuerierOptions) {
    if (options?.baseUrl) this.baseUrl = options.baseUrl
    if (options?.encode) this.encode = options.encode
    if (options?.resultsPerPage) this.$limit = options.resultsPerPage
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
   */
  public generate(options?: GenerateOptions): any {
    const $select = this.cleanSelect()
    const $conditions = this.cleanConditions()
    const $skip = this.cleanSkip()
    const $limit = this.cleanLimit()
    const $sort = this.cleanSort()

    const result = {
      $select,
      $conditions,
      $skip,
      $limit,
      $sort
    }

    return options?.withBaseUrl ? this.generateString(result) : result
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
   */
  private generateString(query: any) {
    query = cleanObject(query)

    query = Object.keys(query).reduce((result: any, key: string) => {
      const value = query[key]
      const type = typeof value

      result[key] = type === 'object' ? JSON.stringify(value) : value

      return result
    }, {})

    if (!Object.keys(query).length) return ''

    const stringified = qs.stringify(query, { encode: this.encode })
    return `${this.baseUrl}?${stringified}`
  }

  /**
   *
   * @param options
   */
  public static query(options: QuerierOptions) {
    return new Querier(options)
  }
}

export interface QuerierOptions {
  baseUrl?: string
  encode?: boolean
  resultsPerPage?: number
}

export interface GenerateOptions {
  withBaseUrl?: boolean
}
