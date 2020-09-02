import * as request from 'supertest'
import { startServer } from './mocks/server'
import { Application } from 'express'

import sequelize from './mocks/database'
import Customer from './mocks/features/customers/Customer'
import User from './mocks/features/users/User'

let app: Application

describe('Neatsio: Controller mixin Neatsio routes', () => {
  beforeAll(async done => {
    await sequelize.authenticate()

    await sequelize.sync({ force: true })

    app = await startServer()

    done()
  })

  describe('GET /customers', () => {
    beforeAll(() => {
      return Customer.create({
        firstname: 'John',
        lastname: 'DOE'
      })
    })

    afterAll(() => {
      return Customer.destroy()
    })

    it('should return an array with customers values', async () => {
      return request(app)
        .get('/customers')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
        })
    })

    it('should return an error because not access token is passed', async () => {
      return request(app)
        .get('/customers/1')
        .expect(401)
    })
  })

  describe('Auth section', () => {
    beforeAll(() => {
      return User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        password: '123'
      })
    })

    afterAll(() => {
      return User.destroy({
        where: {},
        truncate: true
      })
    })

    it('should return an access token', async () => {
      return request(app)
        .post('/auth/login')
        .send({ email: 'john.doe@acme.com', password: '123' })
        .expect(200)
        .then(response => {
          expect(response.body.accessToken).toBeDefined()
        })
    })
  })

  describe('Users section', () => {
    beforeAll(() => {
      return User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        password: '123'
      })
    })

    afterAll(() => {
      return User.destroy({
        where: {},
        truncate: true
      })
    })

    it('should return an array of users', async () => {
      return request(app)
        .get('/users')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
        })
    })
  })
})
