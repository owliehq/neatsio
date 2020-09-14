import { Table, Column, Model, Unique, AllowNull, BeforeSave } from 'sequelize-typescript'
import * as bcrypt from 'bcrypt'

@Table({
  tableName: 'users',
  timestamps: false
})
export default class User extends Model<User> {
  @Column
  lastname: string

  @Column
  firstname: string

  @Unique
  @AllowNull(false)
  @Column
  email: string

  @AllowNull(false)
  @Column
  password: string

  @AllowNull(false)
  @Column
  role: string

  @BeforeSave
  static changePassword(instance: User): void {
    // Execute next steps only if password has changed
    if (!instance.changed('password')) return

    const salt = bcrypt.genSaltSync(10)

    instance.password = bcrypt.hashSync(instance.password, salt)
  }
}
