import { Sequelize } from 'sequelize'
import * as process from 'process'
import * as path from 'path'

export default new Sequelize('sqlite::memory:', { logging: false })
