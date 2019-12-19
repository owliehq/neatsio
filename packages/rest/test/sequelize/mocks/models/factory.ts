import { Model, STRING, FLOAT } from 'sequelize'
import sequelize from '../db'

class Factory extends Model {}

Factory.init(
  {
    name: {
      type: STRING,
      allowNull: false
    },
    city: {
      type: STRING,
      allowNull: false
    },
    latitude: {
      type: FLOAT,
      allowNull: true,
      defaultValue: null,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: FLOAT,
      allowNull: true,
      defaultValue: null,
      validate: { min: -180, max: 180 }
    }
  },
  {
    sequelize,
    modelName: 'factory'
  }
)

export default Factory
