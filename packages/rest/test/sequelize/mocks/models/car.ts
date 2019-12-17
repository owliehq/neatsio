import { Model, DataTypes } from 'sequelize'
import sequelize from '../db'

/**
 *
 */
class Car extends Model {}

//
Car.init(
  {
    license: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'car'
  }
)

export default Car
