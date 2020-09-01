import * as request from 'supertest'
import { startServer } from './mocks/server'
import { Application, response } from 'express'

let app: Application

describe('Server mocked', () => {
  beforeAll(async () => {
    app = await startServer()
  })

  describe('GET /dealerships', () => {
    it('should return an array with dealerships values', async () => {
      return request(app)
        .get('/dealerships')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(2)
        })
    })
  })

  describe('POST /dealerships', () => {
    it('should return the body to response', async () => {
      const body = {
        name: 'DARLING BUSINESS CARS'
      }

      return request(app)
        .post('/dealerships')
        .send(body)
        .expect(200)
        .then(response => {
          expect(response.body).toBeDefined()
        })
    })
  })

  describe('PUT /dealerships/1', () => {
    it('should return body updated', async () => {
      const body = {
        id: 4,
        company: {
          id: 1,
          name: 'Acme'
        }
      }

      return request(app)
        .put('/dealerships/50')
        .send(body)
        .expect(200)
        .then(response => {
          expect(response.body.companyId).toBe(1)
          expect(response.body.id).toBe('50')
          expect(response.body.id2).toBe(4)
        })
    })
  })

  // Try some random combine
  describe('DELETE /dealerships/12/1', () => {
    it('should return body with headers values', async () => {
      return request(app)
        .delete('/dealerships/12/1')
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
