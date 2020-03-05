import * as request from 'supertest'
import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'
import * as md5 from 'md5'

import app from './mocks/neatsio/app'
import sequelize from './mocks/neatsio/db'

import User from './mocks/neatsio/models/user'
import File from './mocks/neatsio/models/file'

const image1 = 'test/data/image1.jpg'

describe('Neatsio server', () => {
  beforeAll(async done => {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })

    done()
  })

  afterAll(async done => {
    await sequelize.close()

    try {
      fs.unlinkSync(path.join(process.cwd(), 'test/data/database.sqlite'))
    } catch (err) {
      console.error(err)
    }

    done()
  })

  describe('Upload a file and save infos in DB', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true })

      await User.create({
        email: 'john.doe@acme.com'
      })
    })

    it('should upload file and return File', async () => {
      let key: string = ''

      await request(app)
        .post('/files')
        .attach('key', image1)
        .field('userId', 1)
        .expect(201)
        .then(response => {
          expect(response.body.key).toBeDefined()
          expect(response.body.userId).toBe(1)
          expect(response.body.id).toBe(1)

          key = response.body.key
        })
        .then(() => {
          const storagePathUploadedFile = path.join(process.cwd(), '/test/uploads', key)
          const dataFromUploadedFile = fs.readFileSync(storagePathUploadedFile, { encoding: 'utf8' })

          const storagePathOriginalFile = path.join(process.cwd(), image1)
          const dataFromOriginalFile = fs.readFileSync(storagePathOriginalFile, { encoding: 'utf8' })

          expect(dataFromUploadedFile).toBe(dataFromOriginalFile)
        })

      await request(app)
        .get('/files')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)

          const [entry] = response.body

          expect(entry).toMatchObject({ id: 1, key, userId: 1 })
        })

      await request(app)
        .get('/files/1/download')
        .expect(200)
        .then(response => {
          const storagePathOriginalFile = path.join(process.cwd(), image1)

          const remoteMd5 = md5(response.body)
          const localMd5 = md5(fs.readFileSync(storagePathOriginalFile))

          expect(remoteMd5).toBe(localMd5)
        })
    })
  })
})
