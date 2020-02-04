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
  describe('Params: $select', () => {
    it('should have $select', () => {
      const query = Querier.query({ stringify: false })
        .select('lastname')
        .generate()

      expect(query.$select).toBe('lastname')
    })

    it('should have ability of multiple select', () => {
      const query = Querier.query({ stringify: false })
        .select('lastname')
        .select('firstname')
        .generate()

      expect(query.$select).toBe('lastname firstname')
    })

    it('should have ability to add negative select', () => {
      const query = Querier.query({ stringify: false })
        .select('lastname')
        .unselect('firstname')
        .generate()

      expect(query.$select).toBe('lastname -firstname')
    })

    it('should return negative when select and unselect next same attribute', () => {
      const query = Querier.query({ stringify: false })
        .select('lastname')
        .unselect('lastname')
        .generate()

      expect(query.$select).toBe('-lastname')
    })

    it('should return selected after an unselect', () => {
      const query = Querier.query({ stringify: false })
        .unselect('lastname')
        .select('lastname')
        .generate()

      expect(query.$select).toBe('lastname')
    })
  })

  describe('Params: $conditions', () => {
    it('should have $conditions params with correct values by raw conditions', () => {
      const query = Querier.query({ stringify: false })
        .rawConditions({
          lastname: 'DOE'
        })
        .generate()

      expect(query.$conditions).toMatchObject({
        lastname: 'DOE'
      })
    })

    it('should have multiple & complex $conditions from raw conditions', () => {
      const query = Querier.query({ stringify: false })
        .rawConditions({
          lastname: 'DOE',
          firstname: {
            $or: ['John', 'Jane']
          }
        })
        .generate()

      expect(query.$conditions).toMatchObject({
        lastname: 'DOE',
        firstname: {
          $or: ['John', 'Jane']
        }
      })
    })
  })

  describe('Params: $limit', () => {
    it('should have $limit param', () => {
      const query = Querier.query({ stringify: false })
        .limit(10)
        .generate()

      expect(query.$limit).toBe(10)
    })
  })

  describe('Params: $skip', () => {
    it('should have $skip param', () => {
      const query = Querier.query({ stringify: false })
        .skip(10)
        .generate()

      expect(query.$skip).toBe(10)
    })
  })

  describe('Params: $skip & limit via page', () => {
    it('should have $skip & $limit param when page is active', () => {
      const query = Querier.query({ stringify: false, resultsPerPage: 20 })
        .page(2)
        .generate()

      expect(query).toMatchObject({
        $limit: 20,
        $skip: 20
      })
    })

    it('should have $skip & $limit param when page is active but without resultPerPage option', () => {
      const query = Querier.query({ stringify: false })
        .page(4)
        .generate()

      expect(query).toMatchObject({
        $limit: 10,
        $skip: 30
      })
    })
  })

  describe('Params: $sort', () => {
    it('should have $sort param by sorting desc', () => {
      const query = Querier.query({ stringify: false })
        .sortDesc('lastname')
        .generate()

      expect(query.$sort).toBe('-lastname')
    })

    it('should have $sort param by sorting asc', () => {
      const query = Querier.query({ stringify: false })
        .sort('lastname')
        .generate()

      expect(query.$sort).toBe('lastname')
    })
  })

  describe('Mixed params', () => {
    it('should return complex query', () => {
      const query = Querier.query({ encode: false, resultsPerPage: 25, stringify: false })
        .page(4)
        .sortDesc('lastname')
        .rawConditions({
          firstname: {
            $or: ['Joe', 'Jane']
          }
        })
        .select('lastname')
        .select('firstname')
        .generate()

      expect(query).toMatchObject({
        $limit: 25,
        $skip: 75,
        $sort: '-lastname',
        $conditions: {
          firstname: {
            $or: ['Joe', 'Jane']
          }
        },
        $select: 'lastname firstname'
      })
    })
  })
})

describe('Build some query strings', () => {
  it('should be string result', () => {
    const query = Querier.query({ baseUrl: '/users', encode: false })
      .select('lastname')
      .generate()

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
