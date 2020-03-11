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

      return request(app)
        .post('/users')
        .expect(200)
        .then(response => {
          expect(response.body).toBeDefined()
        })
    })
  })
})
