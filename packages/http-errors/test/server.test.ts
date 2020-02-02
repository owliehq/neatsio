import * as request from 'supertest'
import { app, appWithDebug } from './mocks/app'

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

/**
 *
 */
describe('Server start normally with debug', () => {
  describe('GET /cars', () => {
    it('should return some values', () => {
      return request(appWithDebug)
        .get('/cars')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(3)
        })
    })

    it('should return 404 Error with debug', () => {
      return request(appWithDebug)
        .get('/notfound')
        .set('Accept', 'application/json')
        .expect(404)
        .then(response => {
          expect(response.body.message).toBe('Not Found')
          expect(response.body.stack).toBeDefined()
        })
    })

    it('should return 406 Not Acceptable', () => {
      return request(appWithDebug)
        .get('/notacceptable')
        .set('Accept', 'application/json')
        .expect(406)
        .then(response => {
          expect(response.body.message).toBe('Not Acceptable')

          console.log(response.body.stack)
        })
    })
  })
})
