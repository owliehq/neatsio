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

describe('Mongoose: POST Method & Routes', () => {
  beforeAll(async done => {
    mongoServer = await db(mongoose)
    done()
  })

  afterAll(async done => {
    await mongoose.disconnect()
    await mongoServer.stop()
    done()
  })

  describe('POST /api/users', () => {
    beforeAll(async () => {
      await Role.create({
        name: 'Member'
      })

      await Role.create({
        name: 'Admin',
        write: true
      })

      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true,
        roleId: 1
      })
    })

    describe('First insertions', () => {
      it('should insert simple user with all required data', async () => {
        const body = {
          firstname: 'Xavier',
          lastname: 'HEN',
          email: 'xavier@leadpositive.fr',
          active: true,
          cars: []
        }

        let id: String = ''

        await request(app)
          .post('/api/users')
          .send(body)
          .set('Accept', 'application/json')
          .expect(201)
          .then(response => {
            id = response.body._id

            expect(response.body).toMatchObject({
              _id: id,
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier@leadpositive.fr',
              active: true
            })
          })

        await request(app)
          .get('/api/users/' + id)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              _id: id,
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier@leadpositive.fr',
              active: true
            })
          })
      })
    })
  })
})
