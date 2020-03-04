import { Sequelize, Promise } from 'sequelize'
import * as process from 'process'
import * as path from 'path'

global.Promise = Promise

export default new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'test/data/database.sqlite'),
  logging: false
})
