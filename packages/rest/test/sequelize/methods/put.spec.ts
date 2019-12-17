import * as request from 'supertest'
import * as qs from 'query-string'
import * as fs from 'fs'
import * as path from 'path'

import app from '../mocks/app'
import sequelize from '../mocks/db'

import User from '../mocks/models/user'
import Car from '../mocks/models/car'
import Role from '../mocks/models/role'
import { response } from 'express'

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

describe('Sequelize: PUT Method & Routes', () => {
  //
  beforeAll(async done => {
    // tslint:disable-next-line: await-promise
    await sequelize.authenticate()

    // tslint:disable-next-line: await-promise
    await sequelize.sync({ force: true })

    done()
  })

  afterAll(async done => {
    // tslint:disable-next-line: await-promise
    await sequelize.close()

    try {
      fs.unlinkSync(path.join(__dirname, '../mocks', 'database.sqlite'))
    } catch (err) {
      console.error(err)
    }

    done()
  })

  //
  describe('PUT /api/users/1', () => {
    beforeAll(async done => {
      // tslint:disable-next-line: await-promise
      await Role.create({
        name: 'Member'
      })

      // tslint:disable-next-line: await-promise
      await Role.create({
        name: 'Admin',
        write: true
      })

      // tslint:disable-next-line: await-promise
      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true,
        roleId: 1
      })

      done()
    })

    afterAll(async () => {
      // tslint:disable-next-line: await-promise
      await User.destroy({ where: {}, truncate: true, restartIdentity: true })

      // tslint:disable-next-line: await-promise
      await Role.destroy({ where: {}, truncate: true, restartIdentity: true })
    })

    describe('Simple updates', () => {
      it('should update only one field', async () => {
        const body = {
          firstname: 'Xavier'
        }

        await request(app)
          .put('/api/users/1')
          .send(body)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 1,
              firstname: 'Xavier',
              lastname: 'DOE',
              email: 'john.doe@acme.com',
              active: true,
              roleId: 1
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
              lastname: 'DOE',
              email: 'john.doe@acme.com',
              active: true,
              roleId: 1
            })
          })
      })

      it('should update many fields', async () => {
        const body = {
          lastname: 'HEN',
          email: 'xavier.hen@leadpositive.fr'
        }

        await request(app)
          .put('/api/users/1')
          .send(body)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 1,
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier.hen@leadpositive.fr',
              active: true,
              roleId: 1
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
              email: 'xavier.hen@leadpositive.fr',
              active: true,
              roleId: 1
            })
          })
      })

      it('should update relation field', async () => {
        const body = {
          roleId: 2
        }

        await request(app)
          .put('/api/users/1')
          .send(body)
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 1,
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier.hen@leadpositive.fr',
              active: true,
              roleId: 2
            })
          })

        const query = {
          $populate: 'role'
        }

        await request(app)
          .get('/api/users/1' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toMatchObject({
              id: 1,
              firstname: 'Xavier',
              lastname: 'HEN',
              email: 'xavier.hen@leadpositive.fr',
              active: true,
              roleId: 2,
              role: {
                id: 2,
                name: 'Admin',
                write: true
              }
            })
          })
      })
    })
  })

  describe('PUT /api/users/bulk', () => {
    beforeAll(async done => {
      // tslint:disable-next-line: await-promise
      await sequelize.sync({ force: true })

      // tslint:disable-next-line: await-promise
      await Role.create({
        name: 'Member'
      })

      // tslint:disable-next-line: await-promise
      await Role.create({
        name: 'Admin',
        write: true
      })

      // tslint:disable-next-line: await-promise
      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: false,
        roleId: 1
      })

      // tslint:disable-next-line: await-promise
      await User.create({
        firstname: 'Jane',
        lastname: 'DOZEN',
        email: 'jane.dozen@acme.com',
        active: true,
        roleId: 2
      })

      // tslint:disable-next-line: await-promise
      await User.create({
        firstname: 'Edouard',
        lastname: 'CALINGO',
        email: 'edouard@acme.com',
        active: false,
        roleId: 1
      })

      // tslint:disable-next-line: await-promise
      await User.create({
        firstname: 'Edouard',
        lastname: 'CALINGO',
        email: 'edouard@acme.com',
        active: false,
        roleId: 1
      })

      done()
    })

    describe('Simple updates', () => {
      it('should update only one field on restrictive query', async () => {
        const body = {
          active: true
        }

        const queryRole = {
          $conditions: {
            roleId: 1
          }
        }

        const queryActive = {
          $conditions: {
            active: true
          }
        }

        await request(app)
          .get('/api/users' + stringify(queryActive))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(1)
          })

        await request(app)
          .put('/api/users/bulk' + stringify(queryRole))
          .send(body)
          .set('Accept', 'application/json')
          .expect(200)

        await request(app)
          .get('/api/users' + stringify(queryActive))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(4)
          })
      })
    })
  })

  describe('PUT /api/role', () => {
    beforeAll(async done => {
      // tslint:disable-next-line: await-promise
      await sequelize.sync({ force: true })

      // tslint:disable-next-line: await-promise
      await Role.create({
        name: 'Member'
      })

      // tslint:disable-next-line: await-promise
      await Role.create({
        name: 'Admin',
        write: true
      })

      done()
    })

    afterAll(async () => {
      // tslint:disable-next-line: await-promise
      await Role.destroy({ where: {}, truncate: true, restartIdentity: true })
    })

    describe('Try to update without good token', () => {
      it('should update only one field on restrictive query', async () => {
        const body = {
          name: 'Administrator'
        }

        await request(app)
          .get('/api/roles/2')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Admin')
          })

        await request(app)
          .put('/api/roles/2')
          .set('Accept', 'application/json')
          .set('Authorization', '123')
          .send(body)
          .expect(403)

        await request(app)
          .get('/api/roles/2')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Admin')
          })
      })
    })

    describe('Simple updates with middlewares', () => {
      it('should update only one field on restrictive query', async () => {
        const body = {
          name: 'Administrator'
        }

        await request(app)
          .get('/api/roles/2')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Admin')
          })

        await request(app)
          .put('/api/roles/2')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .send(body)
          .expect(200)

        await request(app)
          .get('/api/roles/2')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Administrator')
          })
      })
    })
  })
})
