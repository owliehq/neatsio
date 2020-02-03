import { Sequelize, Promise } from 'sequelize'

global.Promise = Promise

export default new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/database.sqlite',
  logging: false
})
