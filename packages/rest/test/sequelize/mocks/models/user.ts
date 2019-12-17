import { Model, DataTypes } from 'sequelize'
import sequelize from '../db'

import Car from './car'
import Role from './role'

/**
 *
 */
class User extends Model {
  /*public id!: number

  public lastname!: string
  public firstname!: string
  public email!: string
  public active!: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date*/
}

//
User.init(
  {
    // attributes
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    underscored: true,
    sequelize,
    modelName: 'user'
    // options
  }
)

User.hasMany(Car)
Car.belongsTo(User)
User.belongsTo(Role)

export default User
