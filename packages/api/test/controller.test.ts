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
      const app = await startApp()

      const body = {
        id: 4,
        company: {
          id: 1,
          name: 'Acme'
        }
      }

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
})
