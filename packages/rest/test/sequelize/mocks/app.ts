import * as express from 'express'
import * as bodyParser from 'body-parser'

import neatsio from '../../../src/neatsio-rest'

import User from './models/user'
import People from './models/people'
import Car from './models/car'
import Brand from './models/brand'
import Role from './models/role'
import Factory from './models/factory'

import { auth } from './middlewares'


// Create express app
const app: express.Application = express()

neatsio.registerModel(User)
neatsio.registerModel(People)
neatsio.registerModel(Car)
neatsio.registerModel(Brand)

neatsio.registerModel(Role, {
  middlewares: {
    before: [auth]
  }
  /*triggers: {
    create() {
      return {
        middlewares: [auth]
      }
    }
  }*/
})

neatsio.registerModel(Factory, {

})

app.use(bodyParser.json())
app.use('/api', neatsio.routes)

// Expose express app just before starting it with "supertest" package for example
export default app
