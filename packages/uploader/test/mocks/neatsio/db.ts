import { Sequelize, Promise } from 'sequelize'
import * as process from 'process'
import * as path from 'path'

global.Promise = Promise

export default new Sequelize('sqlite::memory:', { logging: false })
