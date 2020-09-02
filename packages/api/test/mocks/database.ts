import { Sequelize } from 'sequelize-typescript'
import Customer from './features/customers/Customer'
import User from './features/users/User'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', //__dirname + '/database.db',
  logging: false
})

sequelize.addModels([Customer, User])

export default sequelize
