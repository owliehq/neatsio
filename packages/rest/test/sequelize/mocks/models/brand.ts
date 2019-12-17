import { Model, DataTypes } from 'sequelize'
import sequelize from '../db'
import Car from './car'

/**
 *
 */
class Brand extends Model {}

//
Brand.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'brand'
  }
)

Brand.hasMany(Car)
Car.belongsTo(Brand)

export default Brand
