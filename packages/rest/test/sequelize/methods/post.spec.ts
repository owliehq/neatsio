import * as request from 'supertest'
import * as qs from 'query-string'
import * as fs from 'fs'
import * as path from 'path'

import app from '../mocks/app'
import sequelize from '../mocks/db'

import User from '../mocks/models/user'
import Role from '../mocks/models/role'

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

function stringify(query: {}) {
  query = Object.keys(query).reduce((result: { [key: string]: any }, key: string) => {
    const value = (query as any)[key]
    const type = typeof value

    result[key] = type === 'object' ? JSON.stringify(value) : value

    return result
  }, {})

  return '?' + qs.stringify(query)
}

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
    beforeAll(async () => {
      await sequelize.sync({ force: true })

      await Role.create({
        name: 'Member'
      })

      await Role.create({
        name: 'Admin',
        write: true
      })
    })

    afterAll(async () => {
      await User.destroy({ where: {}, truncate: true, restartIdentity: true })
    })

    describe('First insertions', () => {
      it('should insert simple user with all required data', async () => {
        const body = {
          firstname: 'John',
          lastname: 'DOE',
          email: 'john.doe@acme.com',
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
              firstname: 'John',
              lastname: 'DOE',
              email: 'john.doe@acme.com',
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
              firstname: 'John',
              lastname: 'DOE',
              email: 'john.doe@acme.com',
              active: true
            })
          })
      })
    })

    describe('Populate at creation', () => {
      it('should be populated when is created', async () => {
        const body = {
          firstname: 'John',
          lastname: 'DOE',
          email: 'john.doe@acme.com',
          active: true,
          roleId: 1
        }

        await request(app)
          .post('/api/users?$populate=role')
          .send(body)
          .set('Accept', 'application/json')
          .expect(201)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 2,
              firstname: 'John',
              lastname: 'DOE',
              email: 'john.doe@acme.com',
              active: true,
              roleId: 1,
              role: {
                id: 1,
                name: 'Member'
              }
            })
          })

        await request(app)
          .get('/api/users/2')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 2,
              firstname: 'John',
              lastname: 'DOE',
              email: 'john.doe@acme.com',
              active: true,
              roleId: 1
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

  describe('POST /api/users/query', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true })

      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true
      })

      await User.create({
        firstname: 'Alan',
        lastname: 'SMITH',
        email: 'alan.smith@acme.com',
        active: true
      })

      await User.create({
        firstname: 'Enora',
        lastname: 'PLIRA',
        email: 'enora.plira@acme.com',
        active: false
      })
    })

    afterAll(async () => {
      await User.destroy({ where: {}, truncate: true, restartIdentity: true })
    })

    it('should return filtered data', () => {
      const body = {
        $conditions: {
          lastname: 'PLIRA'
        }
      }

      return request(app)
        .post('/api/users/query')
        .send(body)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)

          expect(response.body[0].lastname).toBe('PLIRA')
          expect(response.body[0].firstname).toBe('Enora')
        })
    })
  })

  describe('POST /api/users/query/count', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true })

      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true
      })

      await User.create({
        firstname: 'Alan',
        lastname: 'SMITH',
        email: 'alan.smith@acme.com',
        active: true
      })

      await User.create({
        firstname: 'Enora',
        lastname: 'PLIRA',
        email: 'enora.plira@acme.com',
        active: false
      })
    })

    afterAll(async () => {
      await User.destroy({ where: {}, truncate: true, restartIdentity: true })
    })

    it('should return count from filtered data', () => {
      const body = {
        $conditions: {
          lastname: 'PLIRA'
        }
      }

      return request(app)
        .post('/api/users/query/count')
        .send(body)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toBe(1)
        })
    })
  })
})
