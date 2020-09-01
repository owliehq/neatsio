import { Sequelize } from 'sequelize-typescript'
import Customer from './features/customers/Customer'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', //__dirname + '/database.db',
  logging: false
})

sequelize.addModels([Customer])

export default sequelize
