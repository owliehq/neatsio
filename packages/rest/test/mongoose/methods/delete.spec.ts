import * as request from 'supertest'
import * as mongoose from 'mongoose'
import * as qs from 'query-string'
import { MongoMemoryServer } from 'mongodb-memory-server'

import app from '../mock/app'
import db from '../mock/db'

import { User, Role } from '../mock/models'

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

let mongoServer: MongoMemoryServer

describe('Mongoose: DELETE Method & Routes', () => {
  beforeAll(async done => {
    mongoServer = await db(mongoose)
    done()
  })

  afterAll(async done => {
    await mongoose.disconnect()
    await mongoServer.stop()
    done()
  })

  describe('DELETE /api/users/:id', () => {
    beforeAll(async () => {

      await User.create({
        _id: '5cfd81600000000000000001',
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true
      })
    })

    describe('Deletion by Id', () => {
      it('should delete user with specific id', async () => {
        await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(1)
          })

        await request(app)
          .delete('/api/users/5cfd81600000000000000001')
          .set('Accept', 'application/json')
          .expect(200)

        await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(0)
          })
      })
    })
  })
})
