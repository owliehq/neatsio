import { Model, DataTypes } from 'sequelize'
import sequelize from '../db'

class File extends Model {}

//
File.init(
  {
    key: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    underscored: true,
    sequelize,
    modelName: 'file'
    // options
  }
)

export default File
