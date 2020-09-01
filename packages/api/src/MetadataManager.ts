import { cpuUsage } from 'process'

export class MetadataManager {
  /**
   *
   */
  public static meta: any = {
    controllers: {}
  }

  /**
   *
   * @param controllerName
   */
  public static registerController(controllerName: string) {
    MetadataManager.meta.controllers[controllerName] = MetadataManager.meta.controllers[controllerName] || {}
  }

  /**
   *
   * @param controllerName
   */
  public static getControllerMetadata(controllerName: string) {
    return MetadataManager.meta.controllers[controllerName]
  }
}
