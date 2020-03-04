import { Model, DataTypes } from 'sequelize'
import sequelize from '../db'

import File from './file'

class User extends Model {}

//
User.init(
  {
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

User.hasMany(File)
File.belongsTo(User)

export default User
