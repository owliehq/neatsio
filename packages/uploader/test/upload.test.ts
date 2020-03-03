import fs from 'fs'
import * as request from 'supertest'
import { app } from './mocks/app'

describe('Server mocked', () => {
  describe('POST /files', () => {
    it('should upload one file', () => {
      return request(app)
        .post('/files')
        .attach('avatar', 'test/data.md')
        .field('onche', 'onche')
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject({ ok: 'ok' })
        })
    })
  })
})
