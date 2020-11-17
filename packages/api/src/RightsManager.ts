const AccessControl = require('role-acl') // WTF happens here again with TS import

const accessControlInstance = new AccessControl()

export class RightsManager {
  /**
   *
   */
  public acl: any[] = []

  /**
   *
   * @param resource
   */
  constructor(protected resource: string) {}

  /**
   *
   * @param role
   * @param action
   * @param attributes
   * @param condition
   */
  addRight(role: string, action: string | Array<string>, attributes: Array<string> = ['*'], condition?: Function) {
    const { resource } = this

    const right = {
      resource,
      role,
      action,
      attributes,
      condition
    }

    this.addRightToAcl(right)
  }

  /**
   *
   * @param acl
   */
  private addRightToAcl(right: any) {
    this.acl.push(right)
  }

  /**
   *
   */
  static applyRights() {
    RightsManager.accessController.setGrants(RightsManager.rights)
  }

  /**
   *
   */
  static registerRightsController(rightsManager: RightsManager) {
    RightsManager.rights.push(...rightsManager.acl)
  }

  /**
   *
   */
  static getRole(user: any) {
    return RightsManager.roleCallback(user)
  }

  /**
   *
   */
  static accessController = accessControlInstance

  /**
   *
   */
  static rights: any[] = []

  /**
   *
   */
  static roleCallback: Function = (user: any) => user.role
}
