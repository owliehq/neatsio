import * as request from 'supertest'
import { startServer } from './mocks/server'
import { Application, response } from 'express'

let app: Application

describe('Server mocked', () => {
  beforeAll(async () => {
    app = await startServer()
  })

  describe('GET /onche', () => {
    it('should return an 404 error', async () => {
      return request(app)
        .get('/onche')
        .expect(404)
    })
  })
})
