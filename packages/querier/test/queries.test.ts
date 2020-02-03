import * as request from 'supertest'
import * as qs from 'query-string'
import * as fs from 'fs'
import * as path from 'path'

import app from './mocks/app'
import sequelize from './mocks/db'

import { Querier } from '../src/querier'

import User from './mocks/models/user'

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

describe('Build some queries object', () => {
  it('should have $select', () => {
    const querier = new Querier()

    const query = querier.select('lastname').generate()

    expect(query.$select).toBe('lastname')
  })
})

describe('Build some query strings', () => {
  it('should be string result', () => {
    const baseUrl = '/users'

    const querier = new Querier({ baseUrl })

    const query = querier.select('lastname').generate({ withBaseUrl: true })

    expect(query).toBe('/users?$select=lastname')
  })
})

/**
 *
 */
/*describe('Play with users', () => {
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

  describe('GET: Users', () => {
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

    it('should')
  })
})*/
