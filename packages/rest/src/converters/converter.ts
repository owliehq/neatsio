export abstract class Converter {
  protected conditions?: any
  protected limit?: any
  protected skip?: any
  protected sort?: any
  protected select?: any
  protected populate?: any

  constructor(query: ParsedQuery) {
    this.conditions = query.conditions
    this.limit = query.limit
    this.skip = query.skip
    this.sort = query.sort
    this.select = query.select
    this.populate = query.populate
  }

  abstract toParams(): any
}

export interface ParsedQuery {
  conditions?: any
  skip?: any
  sort?: any
  limit?: any
  select?: any
  populate?: any
}
