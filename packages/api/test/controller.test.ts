import * as request from 'supertest'

import app from './mocks/server'

describe('Server mocked', () => {
  describe('GET /users', () => {
    it('should return an array with users values', () => {
      request(app)
        .get('/users')
        .expect(200)
        .then(response => {
          console.error(response.body)
          expect(response.body).toHaveLength(2)
        })
    })
  })
})
