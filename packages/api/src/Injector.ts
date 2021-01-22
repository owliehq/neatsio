import { Class } from 'type-fest'
import 'reflect-metadata'

class Container {
  private providers: Map<string, any> = new Map()

  resolve(target: string): any {
    const resolved = this.providers.get(target)

    if (!resolved) throw new Error(`No provider found for ${target}!`)

    return resolved
  }

  addProvider<T>(target: Class<T>) {
    this.providers.set(target.name, new target())
  }
}

export const providerContainer = new Container()
