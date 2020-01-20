import { Model, DataTypes } from 'sequelize'
import sequelize from '../db'

/**
 *
 */
class Article extends Model {}

//
Article.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notation: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'article'
  }
)

export default Article
