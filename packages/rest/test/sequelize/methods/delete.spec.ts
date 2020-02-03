import * as request from 'supertest'
import * as fs from 'fs'
import * as path from 'path'

import app from '../mocks/app'
import sequelize from '../mocks/db'

import User from '../mocks/models/user'

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

describe('Sequelize: POST Method & Routes', () => {
  //
  beforeAll(async done => {
    await sequelize.authenticate()

    await sequelize.sync({ force: true })

    done()
  })

  afterAll(async done => {
    await sequelize.close()

    try {
      fs.unlinkSync(path.join(__dirname, '../mocks', 'database.sqlite'))
    } catch (err) {
      console.error(err)
    }

    done()
  })

  //
  describe('DELETE /api/users/1', () => {
    beforeAll(async done => {
      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true
      })

      done()
    })

    describe('Deletion by Id', () => {
      it('should delete user with specific id', async () => {
        await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(1)
          })

        await request(app)
          .delete('/api/users/1')
          .set('Accept', 'application/json')
          .expect(200)

        await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(0)
          })
      })
    })
  })
})
