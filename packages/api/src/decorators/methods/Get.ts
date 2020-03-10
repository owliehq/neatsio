import { asyncWrapper } from '@owliehq/async-wrapper'
import { RequestHandler } from 'express'

export const Get = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
  const handler = asyncWrapper(async (req, res) => {
    const result = await target[propertyKey]
    res.status(200).json(result)
  })

  console.log(descriptor)

  return handler
}
