import * as request from 'supertest'
import { startServer } from './mocks/server'
import { Application } from 'express'

import sequelize from './mocks/database'
import Customer from './mocks/features/customers/Customer'
import User from './mocks/features/users/User'

const destroyOptions = {
  where: {},
  truncate: true,
  restartIdentity: true
}

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
      return Customer.destroy(destroyOptions)
    })

    /*it('should return an array with customers values', async () => {
      return request(app)
        .get('/customers')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
        })
    })*/
  })

  describe('Auth section', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true })

      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        password: '123',
        role: 'admin'
      })

      await Customer.create({
        firstname: 'Arnold',
        lastname: 'LEVIATHAN'
      })
    })

    afterAll(async () => {
      await User.destroy(destroyOptions)
      await Customer.destroy(destroyOptions)
    })

    let accessToken: string

    it('should return an access token', async () => {
      return request(app)
        .post('/auth/login')
        .send({ email: 'john.doe@acme.com', password: '123' })
        .expect(200)
        .then(response => {
          accessToken = response.body.accessToken
          expect(response.body.accessToken).toBeDefined()
        })
    })

    it('should not give access to required auth route without access token', async () => {
      return request(app)
        .get('/customers/1')
        .expect(401)
    })

    it('should not give access to required auth route with false access token', async () => {
      return request(app)
        .get('/customers/1')
        .set('Authorization', `Bearer ex.cede.fefe`)
        .expect(401)
    })

    it('should give access to required auth route with access token', async () => {
      return request(app)
        .get('/customers/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.lastname).toBe('LEVIATHAN')
        })
    })

    it('should get custom route on neatsio config', async () => {
      return request(app)
        .get('/customers/1/download')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })
  })

  describe('Validations', () => {
    let token: string

    beforeAll(async () => {
      await User.sync({ force: true })

      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        password: '123',
        role: 'admin'
      })

      token = await request(app)
        .post('/auth/login')
        .send({
          email: 'john.doe@acme.com',
          password: '123'
        })
        .then(response => response.body.accessToken)
    })

    afterAll(() => {
      return Customer.destroy(destroyOptions)
    })

    it('should return error when validations are not fullfilled', async () => {
      return request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({ lastname: 'D' })
        .expect(422)
    })

    it('should create customer when validations are fullfilled', async () => {
      return request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({ lastname: 'DOE', firstname: 'John' })
        .expect(201)
    })
  })

  describe('Service Injection', () => {
    beforeAll(async () => {
      await Customer.sync({ force: true })

      await Customer.create({
        lastname: 'DOE',
        firstname: 'John',
        email: 'john.doe@acme.com'
      })

      await Customer.create({
        lastname: 'DOE',
        firstname: 'Jane',
        email: 'jane.doe@acme.com'
      })
    })

    it('should return john customer with correct triggered value', async () => {
      return request(app)
        .get('/customers/email/john.doe@acme.com')
        .expect(200)
        .then(response => {
          expect(response.body.email).toBe('john.doe@acme.com')
          expect(response.body.triggeredOnBeforeSave).toBe(true)
        })
    })

    it('should return jane customer with falsy not triggered value', async () => {
      return request(app)
        .get('/customers/email/jane.doe@acme.com')
        .expect(200)
        .then(response => {
          expect(response.body.email).toBe('jane.doe@acme.com')
          expect(response.body.triggeredOnBeforeSave).toBe(false)
        })
    })
  })

  describe('Users section', () => {
    beforeAll(async () => {
      await User.sync({ force: true })

      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        password: '123',
        role: 'admin'
      })
    })

    afterAll(() => {
      return User.destroy(destroyOptions)
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
