import * as request from 'supertest'
import { startServer } from './mocks/server'
import { Application, response } from 'express'

import sequelize from './mocks/database'
import Customer from './mocks/features/customers/Customer'

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
})
