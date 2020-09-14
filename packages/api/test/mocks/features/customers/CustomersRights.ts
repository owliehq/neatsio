import { NeatsioActions, RightsManager } from '../../../../src'

class CustomersRights extends RightsManager {
  constructor() {
    super('customer')
    this.addRight('admin', NeatsioActions.GET_MANY)

    this.addRight('user', NeatsioActions.GET_ONE)
  }
}

export default new CustomersRights()
