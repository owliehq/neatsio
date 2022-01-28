import { Sequelize } from 'sequelize'

export default new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/database.sqlite',
  logging: false
})
