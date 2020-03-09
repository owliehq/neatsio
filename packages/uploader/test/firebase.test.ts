import * as fs from 'fs-extra'
import * as path from 'path'
import * as process from 'process'
import * as request from 'supertest'
import * as md5 from 'md5'

import { app } from './mocks/firebase/app'

describe('Server mocked', () => {
  describe('POST /files', () => {
    it('should upload one file', async () => {
      const markdown = 'test/data/test1.markdown'

      await request(app)
        .post('/files')
        .attach('markdown', markdown)
        .expect(200)
        .then(response => {
          expect(response.body.markdown).toBeDefined()
          return response.body.markdown
        })
        .then(key => {
          return request(app)
            .get(`/files/${key}`)
            .expect(200)
            .then(response => {
              const storagePathOriginalFile = path.join(process.cwd(), markdown)

              const remoteMd5 = md5(response.body)
              const localMd5 = md5(fs.readFileSync(storagePathOriginalFile))

              expect(remoteMd5).toBe(localMd5)
            })
        })
    })
  })
})
