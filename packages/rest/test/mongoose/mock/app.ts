import * as express from 'express'
import * as bodyParser from 'body-parser'

import neatsio from '../../../src/neatsio-rest'

import { User, Car, People, Role } from './models'

import { auth } from './middlewares'

// Create express app
const app: express.Application = express()

neatsio.registryModel(User, {
  routes: [
    {
      method: 'GET',
      path: '/me',
      middlewares: [],
      execute: async (req: any, res: any, next: any) => {
        const users = await User.find()
        return res.json(users)
      }
    }
  ]
})

neatsio.registryModel(Car)

neatsio.registryModel(People)

neatsio.registryModel(Role, {
  middlewares: {
    before: [auth]
  }
})

app.use(bodyParser.json())
app.use('/api', neatsio.routes)

// Expose express app just before starting it with "supertest" package for example
export default app
