import * as request from 'supertest'
import { startServer } from './mocks/server'
import { Application, response } from 'express'

let app: Application

describe('Server mocked', () => {
  beforeAll(async () => {
    app = await startServer(3003)
  })

  describe('GET /params/query', () => {
    it('should return query value from one specific query param', async () => {
      return request(app)
        .get('/cars/query?code=abc')
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject({ code: 'abc' })
        })
    })
  })

  // TODO: make others params decorators
})
