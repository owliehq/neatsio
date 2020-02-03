import { Model, STRING, BOOLEAN } from 'sequelize'
import sequelize from '../db'

class Role extends Model {}

Role.init(
  {
    name: {
      type: STRING,
      allowNull: false
    },
    read: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    write: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'role'
  }
)

export default Role
