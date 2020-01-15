import { Model, STRING } from 'sequelize'
import sequelize from '../db'

class Team extends Model {}

Team.init(
  {
    name: {
      type: STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'team'
  }
)

export default Team
