import * as request from 'supertest'
import * as fs from 'fs'
import * as path from 'path'

import app from './mocks/app'
import sequelize from './mocks/db'

describe('Sequelize: Crash database handling', () => {
  //
  beforeAll(async done => {
    
    await sequelize.authenticate()

    
    await sequelize.close()

    done()
  })

  //
  afterAll(async done => {
    try {
      fs.unlinkSync(path.join(__dirname, './mocks', 'database.sqlite'))
    } catch (err) {
      console.error(err)
    }

    done()
  })

  describe('GET /api/users', () => {
    describe('No connection to database', () => {
      it('should return 500', () => {
        return request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(500)
          .then(response => {
            expect(response.status).toBe(500)
            //expect(response.body.message).toBe('Internal Server Error')
          })
      })
    })
  })
})
