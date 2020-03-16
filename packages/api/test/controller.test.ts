import * as request from 'supertest'

import { startApp } from './mocks/server'
import { response } from 'express'

describe('Server mocked', () => {
  describe('GET /users', () => {
    it('should return an array with users values', async () => {
      const app = await startApp()

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
      const app = await startApp()

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
      const app = await startApp()

      const body = {
        company: {
          id: 1,
          name: 'Acme'
        }
      }

      return request(app)
        .put('/users/1')
        .send(body)
        .expect(200)
        .then(response => {
          expect(response.body).toBe(1)
        })
    })
  })
})
