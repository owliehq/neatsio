import { Table, Column, Model, BeforeSave, Default } from 'sequelize-typescript'
import { Inject } from '../../../../src'
import { CustomerService } from './CustomerService'

@Table({
  tableName: 'customers',
  timestamps: false
})
export default class Customer extends Model {
  @Inject private customerService: CustomerService

  @Column
  lastname: string

  @Column
  firstname: string

  @Column
  email: string

  @Default(false)
  @Column
  triggeredOnBeforeSave: boolean

  @BeforeSave
  static async setTriggerValue(instance: Customer) {
    instance.triggeredOnBeforeSave = instance.customerService.isJohn(instance)
  }
}
