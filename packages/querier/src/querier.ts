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

  private $select: Array<string> = []
  private $conditions: any = {}

  constructor(options?: QuerierOptions) {
    if (options?.baseUrl) this.baseUrl = options.baseUrl
  }

  /**
   *
   * @param input
   */
  public select(input: string): Querier {
    if (!this.$select.includes(input)) this.$select.push(input)
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
   */
  public generate(options?: GenerateOptions): any {
    const $select = this.cleanSelect()
    const $conditions = this.cleanConditions()

    const result = {
      $select,
      $conditions
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

    const stringified = qs.stringify(query, { encode: false })
    return `${this.baseUrl}?${stringified}`
  }
}

export interface QuerierOptions {
  baseUrl?: string
}

export interface GenerateOptions {
  withBaseUrl?: boolean
}
