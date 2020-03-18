import * as request from 'supertest'
import { startServer } from './mocks/server'
import { Application, response } from 'express'

let app: Application

describe('Server mocked', () => {
  beforeAll(async () => {
    app = await startServer()
  })

  describe('GET /users', () => {
    it('should return an array with users values', async () => {
      return request(app)
        .get('/users')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(2)
        })
    })
  })

  describe('POST /users', () => {
    it('should return the body to response', async () => {
      const body = {
        lastname: 'DOE',
        firstname: 'John'
      }

      return request(app)
        .post('/users')
        .send(body)
        .expect(200)
        .then(response => {
          expect(response.body).toBeDefined()
        })
    })
  })

  describe('PUT /users/1', () => {
    it('should return body updated', async () => {
      const body = {
        id: 4,
        company: {
          id: 1,
          name: 'Acme'
        }
      }

      return request(app)
        .put('/users/50')
        .send(body)
        .expect(200)
        .then(response => {
          expect(response.body.companyId).toBe(1)
          expect(response.body.id).toBe('50')
          expect(response.body.id2).toBe(4)
        })
    })
  })

  describe('DELETE /users/12/1', () => {
    it('should return body updated', async () => {
      return request(app)
        .delete('/users/12/1')
        .accept('application/json')
        .expect(200)
        .then(response => {
          expect(response.body.companyId).toBe('12')
          expect(response.body.acceptHeader).toBe('application/json')
        })
    })
  })

  describe('GET /cars', () => {
    it('should return value set in a custom middleware', async () => {
      return request(app)
        .get('/cars')
        .expect(401)
        .then(response => {
          //expect(response.body).toHaveLength(1)
        })
    })
  })
})
