import { Class } from 'type-fest'
import 'reflect-metadata'

class Container {
  private providers: Map<string, any> = new Map()

  resolve<T>(target: string | Class<T>): T {
    let name = ''
    if(typeof target === 'string'){
      name = target
     } else {
       name = target?.name
       if(!name) throw new Error('Unable to retrieve name of target class')
     }
    const resolved = this.providers.get(name)
    if (!resolved) throw new Error(`No provider found for ${target}!`)
    return resolved
  }

  addProvider<T>(target: Class<T>) {
    this.providers.set(target.name, new target())
  }
}

export const providerContainer = new Container()
