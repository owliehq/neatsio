import * as request from 'supertest'
import app from './mocks/app'

/**
 *
 */
describe('Server start normally without debug', () => {
  describe('GET /cars', () => {
    it('should return some values without error', () => {
      return request(app)
        .get('/cars')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(3)
        })
    })

    it('should return 404 Error', () => {
      return request(app)
        .get('/notfound')
        .set('Accept', 'application/json')
        .expect(404)
        .then(response => {
          expect(response.body.message).toBe('Not Found')
        })
    })

    it('should return 406 Not Acceptable', () => {
      return request(app)
        .get('/notacceptable')
        .set('Accept', 'application/json')
        .expect(406)
        .then(response => {
          expect(response.body.message).toBe('Not Acceptable')
        })
    })
  })
})
