import * as request from 'supertest'
import { startServer } from './mocks/server'
import { Application, response } from 'express'

let app: Application

describe('Server mocked', () => {
  beforeAll(async () => {
    app = await startServer(3004)
  })

  describe('GET /cars/service', () => {
    it('should return value via services init in construtor', async () => {
      return request(app)
        .get('/cars/service')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(2)

          expect(response.body[0].registration).toBe('AA-000-BB')
          expect(response.body[1].registration).toBe('CC-111-DD')
        })
    })
  })
})
