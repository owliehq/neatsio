import { Table, Column, Model } from 'sequelize-typescript'

@Table({
  tableName: 'customers',
  timestamps: false
})
export default class Customer extends Model<Customer> {
  @Column
  lastname: string

  @Column
  firstname: string
}
