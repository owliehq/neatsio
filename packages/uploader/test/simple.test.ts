import * as fs from 'fs-extra'
import * as path from 'path'
import * as process from 'process'
import * as request from 'supertest'
import { app } from './mocks/simple/app'

describe('Server mocked', () => {
  describe('POST /files', () => {
    afterAll(() => {
      fs.removeSync(path.join(process.cwd(), 'test/uploads'))
    })

    it('should upload one file', () => {
      return request(app)
        .post('/files')
        .attach('markdown', 'test/data/test1.markdown')
        .expect(200)
        .then(response => {
          const { markdown } = response.body
          expect(markdown).toBeDefined()
          return markdown
        })
        .then(key => {
          const storagePathUploadedFile = path.join(process.cwd(), '/test/uploads', key)
          const dataFromUploadedFile = fs.readFileSync(storagePathUploadedFile, { encoding: 'utf8' })

          const storagePathOriginalFile = path.join(process.cwd(), 'test/data/test1.markdown')
          const dataFromOriginalFile = fs.readFileSync(storagePathOriginalFile, { encoding: 'utf8' })

          expect(dataFromUploadedFile).toBe(dataFromOriginalFile)
        })
    })

    it('should return other fields in parallel of upload', () => {
      return request(app)
        .post('/files')
        .attach('markdown', 'test/data/test1.markdown')
        .field('title', 'My title')
        .expect(200)
        .then(response => {
          const { markdown, title } = response.body
          expect(markdown).toBeDefined()
          expect(title).toBe('My title')
        })
    })
  })
})
