import { Request, Response, NextFunction } from 'express'
import { asyncWrapper } from '@owliehq/async-wrapper'
import { HttpError } from '@owliehq/http-errors'
import { RightsManager } from '../RightsManager'

export const roleMiddleware = (resource: string, action: string, prepareContext?: Function) => {
  const callback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as any

    if (!user) throw Error(`You have not called AuthMiddleware before this one (RoleMiddleware).`)

    const role = await RightsManager.getRole(user)

    if (!role) throw Error(`There's an error with user's role, maybe the callback is not set correctly.`)

    if (!RightsManager.accessController.getRoles().includes(role))
      throw HttpError.Forbidden({
        message: `You don't have the right ACL to execute this action on optional requested resource.`
      })

    const permission = await RightsManager.accessController
      .can(role)
      .context({
        body: req.body,
        params: req.params,
        user,
        custom: prepareContext ? await prepareContext(req) : undefined
      })
      .execute(action)
      .on(resource)

    if (!permission.granted)
      throw HttpError.Forbidden({
        message: `You don't have the right ACL to execute this action on optional requested resource.`
      })

    next()
  }

  return asyncWrapper(callback)
}
