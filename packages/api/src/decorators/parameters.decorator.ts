import { MetadataManager } from '../MetadataManager'
import { set } from 'dot-prop'

export const Body = (target: { [key: string]: any }, key: string, index: number) => {
  set(MetadataManager.meta, `controllers.${target.constructor.name}.routesParameters.${key}.${index}`, {
    getValue: (req: Request) => {
      return req.body
    }
  })
}
