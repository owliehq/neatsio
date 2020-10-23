export class Configuration {
  public includeLimit = 50

  // TODO: interface & throwing errors
  constructor(options: any = {}) {
    options = options || {}

    this.includeLimit = options.includeLimit || 100
  }
}
