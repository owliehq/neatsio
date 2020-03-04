import * as request from 'supertest'
import * as fs from 'fs'
import * as path from 'path'

import app from './mocks/neatsio/app'
import sequelize from './mocks/neatsio/db'

import User from './mocks/neatsio/models/user'
import File from './mocks/neatsio/models/file'

describe('Neatsio server', () => {
  beforeAll(async done => {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })

    done()
  })

  afterAll(async done => {
    await sequelize.close()

    try {
      fs.unlinkSync(path.join(__dirname, '../mocks/neatsio', 'database.sqlite'))
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

    it('should upload file and return File', () => {
      return request(app)
        .post('/files')
        .attach('key', 'test/data/image1.jpg')
        .field('userId', 1)
        .expect(200)
        .then(response => {
          const { key } = response.body
          expect(key).toBeDefined()
        })
    })
  })
})
