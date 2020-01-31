import * as request from 'supertest'
import { app } from './mocks/app'

describe('Server start normally', () => {
  describe('GET /users', () => {
    it('should return some values with async use', () => {
      return request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(2)
        })
    })
  })

  describe('GET /cars', () => {
    it('should return some values without async use', () => {
      return request(app)
        .get('/cars')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(3)
        })
    })
  })
})
