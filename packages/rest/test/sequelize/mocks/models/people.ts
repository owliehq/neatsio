import { Model, STRING } from 'sequelize'
import sequelize from '../db'

class People extends Model {}

People.init(
  {
    // attributes
    email: {
      type: STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'people'
    // options
  }
)

export default People
