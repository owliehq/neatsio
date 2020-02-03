import * as request from 'supertest'
import * as fs from 'fs'
import * as path from 'path'

import app from '../mocks/app'
import sequelize from '../mocks/db'

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
  describe('POST /api/users', () => {
    describe('First insertions', () => {
      it('should insert simple user with all required data', async () => {
        const body = {
          firstname: 'Xavier',
          lastname: 'HEN',
          email: 'xavier@leadpositive.fr',
          active: true
        }

        await request(app)
          .post('/api/users')
          .send(body)
          .set('Accept', 'application/json')
          .expect(201)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 1,
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier@leadpositive.fr',
              active: true
            })
          })

        await request(app)
          .get('/api/users/1')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 1,
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier@leadpositive.fr',
              active: true
            })
          })
      })
    })
  })

  describe('POST /api/users/bulk', () => {
    beforeAll(async done => {
      await sequelize.sync({ force: true })

      done()
    })

    describe('Bulk insertions', () => {
      it('should insert multiples users with all required data', async () => {
        const body = [
          {
            firstname: 'Xavier',
            lastname: 'HEN',
            email: 'xavier@leadpositive.fr',
            active: true
          },
          {
            firstname: 'John',
            lastname: 'DOE',
            email: 'john.doe@acme.com',
            active: false
          }
        ]

        await request(app)
          .post('/api/users/bulk')
          .send(body)
          .set('Accept', 'application/json')
          .expect(201)

        await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(2)

            expect(response.body[0].id).toBe(1)
            expect(response.body[0].lastname).toBe('HEN')

            expect(response.body[1].id).toBe(2)
            expect(response.body[1].lastname).toBe('DOE')
          })
      })
    })
  })
})
