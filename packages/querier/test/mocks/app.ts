import * as express from 'express'
import neatsio from '@owliehq/neatsio'

import Querier from '../../src/querier'

import User from './models/user'
import Car from './models/car'
import Brand from './models/brand'
import Role from './models/role'

// Create express app
const app: express.Application = express()

neatsio.registerModel(User)
neatsio.registerModel(Car)
neatsio.registerModel(Brand)
neatsio.registerModel(Role)

app.use('/api', neatsio.routes)

// Expose express app just before starting it with "supertest" package for example
export default app
