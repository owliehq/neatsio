import * as express from 'express'
import * as bodyParser from 'body-parser'
import { errorsMiddleware } from '@owliehq/http-errors'

import neatsio from '../../../src/neatsio-rest'

import User from './models/user'
import People from './models/people'
import Car from './models/car'
import Brand from './models/brand'
import Role from './models/role'
import Factory from './models/factory'
import Team from './models/team'
import Article from './models/article'

import { auth } from './middlewares'
import { RequestHandler } from 'express'

// Create express app
const app: express.Application = express()

neatsio.registerModel(User)
neatsio.registerModel(People)
neatsio.registerModel(Car)
neatsio.registerModel(Brand)
neatsio.registerModel(Factory)

neatsio.registerModel(Role, {
  middlewares: {
    before: [auth]
  }
})

neatsio.registerModel(Team, {
  middlewares: {
    getOne: {
      before: [auth],
      after: []
    },
    getMany: {
      before: [],
      after: []
    },
    createOne: {
      before: [auth],
      after: []
    },
    createBulk: {
      before: [auth],
      after: []
    },
    updateOne: {
      before: [auth],
      after: []
    },
    updateBulk: {
      before: [auth],
      after: []
    },
    deleteOne: {
      before: [auth],
      after: []
    }
  }
})

neatsio.registerModel(Article, {
  hiddenAttributes: ['notation']
})

app.use(bodyParser.json())
app.use('/api', neatsio.routes)

// Expose express app just before starting it with "supertest" package for example
export default app
