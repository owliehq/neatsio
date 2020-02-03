import * as request from 'supertest'
import * as mongoose from 'mongoose'
import * as qs from 'query-string'
import { MongoMemoryServer } from 'mongodb-memory-server'

import app from '../mock/app'
import db from '../mock/db'

import { User, Role } from '../mock/models'

let mongoServer: MongoMemoryServer

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

function stringify(query: {}) {
  query = Object.keys(query).reduce((result: { [key: string]: any }, key: string) => {
    const value = (query as any)[key]
    const type = typeof value

    result[key] = type === 'object' ? JSON.stringify(value) : value

    return result
  }, {})

  return '?' + qs.stringify(query)
}

describe('Mongoose: PUT Method & Routes', () => {
  beforeAll(async done => {
    mongoServer = await db(mongoose)
    done()
  })

  afterAll(async done => {
    await mongoose.disconnect()
    await mongoServer.stop()
    done()
  })

  //
  describe('PUT /api/users/:id', () => {
    beforeAll(async done => {
      await Role.create({
        _id: '5cfd81600000000000000000',
        name: 'Member'
      })

      
      await Role.create({
        _id: '5cfd81600000000000000001',
        name: 'Admin',
        write: true
      })

      
      await User.create({
        _id: '5cfd81600000000000000100',
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true,
        role: '5cfd81600000000000000000'
      })

      done()
    })

    afterAll(async () => {
      await Promise.all([User.deleteMany({}), Role.deleteMany({})])
    })

    describe('Simple updates', () => {
      it('should update only one field', async () => {
        const body = {
          firstname: 'Xavier'
        }

        await request(app)
          .put('/api/users/5cfd81600000000000000100')
          .send(body)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              _id: '5cfd81600000000000000100',
              firstname: 'Xavier',
              lastname: 'DOE',
              email: 'john.doe@acme.com',
              active: true,
              role: '5cfd81600000000000000000'
            })
          })

        await request(app)
          .get('/api/users/5cfd81600000000000000100')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              _id: '5cfd81600000000000000100',
              firstname: 'Xavier',
              lastname: 'DOE',
              email: 'john.doe@acme.com',
              active: true,
              role: '5cfd81600000000000000000'
            })
          })
      })

      it('should update many fields', async () => {
        const body = {
          lastname: 'HEN',
          email: 'xavier.hen@leadpositive.fr'
        }

        await request(app)
          .put('/api/users/5cfd81600000000000000100')
          .send(body)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              _id: '5cfd81600000000000000100',
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier.hen@leadpositive.fr',
              active: true,
              role: '5cfd81600000000000000000'
            })
          })

        await request(app)
          .get('/api/users/5cfd81600000000000000100')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              _id: '5cfd81600000000000000100',
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier.hen@leadpositive.fr',
              active: true,
              role: '5cfd81600000000000000000'
            })
          })
      })

      it('should update relation field', async () => {
        const body = {
          role: '5cfd81600000000000000001'
        }

        await request(app)
          .put('/api/users/5cfd81600000000000000100')
          .send(body)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              _id: '5cfd81600000000000000100',
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier.hen@leadpositive.fr',
              active: true,
              role: '5cfd81600000000000000001'
            })
          })

        const query = {
          $populate: 'role'
        }

        await request(app)
          .get('/api/users/5cfd81600000000000000100' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              _id: '5cfd81600000000000000100',
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier.hen@leadpositive.fr',
              active: true,
              role: {
                _id: '5cfd81600000000000000001',
                name: 'Admin',
                write: true
              }
            })
          })
      })
    })

    describe('Try to update without good token', () => {
      it('should update only one field on restrictive query', async () => {
        const body = {
          name: 'Administrator'
        }

        await request(app)
          .get('/api/roles/5cfd81600000000000000001')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Admin')
          })

        await request(app)
          .put('/api/roles/5cfd81600000000000000001')
          .set('Accept', 'application/json')
          .set('Authorization', '123')
          .send(body)
          .expect(403)

        await request(app)
          .get('/api/roles/5cfd81600000000000000001')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Admin')
          })
      })
    })

    describe('Simple updates with middlewares', () => {
      it('should update only one field on restrictive query', async () => {
        const body = {
          name: 'Administrator'
        }

        await request(app)
          .get('/api/roles/5cfd81600000000000000001')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Admin')
          })

        await request(app)
          .put('/api/roles/5cfd81600000000000000001')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .send(body)
          .expect(200)

        await request(app)
          .get('/api/roles/5cfd81600000000000000001')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Administrator')
          })
      })
    })
  })
})
