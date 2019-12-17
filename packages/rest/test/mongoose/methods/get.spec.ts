import * as request from 'supertest'
import * as mongoose from 'mongoose'
import * as qs from 'query-string'
import { MongoMemoryServer } from 'mongodb-memory-server'

import app from '../mock/app'
import db from '../mock/db'
import User from '../mock/models/user'
import Car from '../mock/models/car'
import Brand from '../mock/models/brand'

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

let mongoServer: MongoMemoryServer

function stringify(query: {}) {
  query = Object.keys(query).reduce((result: { [key: string]: any }, key: string) => {
    const value = (query as any)[key]
    const type = typeof value

    result[key] = type === 'object' ? JSON.stringify(value) : value

    return result
  }, {})

  return '?' + qs.stringify(query)
}

/**
 * Basic usage
 */
describe('Mongoose: GET /api/users', () => {
  beforeAll(async done => {
    mongoServer = await db(mongoose)
    done()
  })

  afterAll(async done => {
    await mongoose.disconnect()
    await mongoServer.stop()
    done()
  })

  //
  describe('Empty collection', () => {
    it('should return empty collection', () => {
      return request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([])
        })
    })

    it('should return empty collection with special pluralization', () => {
      return request(app)
        .get('/api/people')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([])
        })
    })

    it("should return an 404 HTTP error when a collection doesn't exist", () => {
      return request(app)
        .get('/api/countries')
        .set('Accept', 'application/json')
        .expect(404)
    })
  })

  //
  describe('With one entry', () => {
    beforeAll(() => {
      return User.create({
        _id: '5cfd81600000000000000000',
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com'
      })
    })

    afterAll(() => {
      return User.deleteMany({})
    })

    it('should get one user on an array', () => {
      return request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
          expect(response.body[0]._id).toBe('5cfd81600000000000000000')
          expect(response.body[0].lastname).toBe('DOE')
          expect(response.body[0].firstname).toBe('John')
          expect(response.body[0].email).toBe('john.doe@acme.com')
        })
    })

    it('should get user by id', () => {
      return request(app)
        .get('/api/users/5cfd81600000000000000000')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body._id).toBe('5cfd81600000000000000000')
          expect(response.body.lastname).toBe('DOE')
        })
    })

    it("should return an 404 HTTP error when user doesn't exist", () => {
      return request(app)
        .get('/api/users/5cfd81600000000000000001')
        .set('Accept', 'application/json')
        .expect(404)
    })
  })

  //
  describe('With some entries to conditionals tests', () => {
    beforeAll(async done => {
      await User.create({
        _id: '5cfd81600000000000000000',
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true
      })

      await User.create({
        _id: '5cfd81600000000000000001',
        firstname: 'Alan',
        lastname: 'SMITH',
        email: 'alan.smith@acme.com',
        active: true
      })
      await User.create({
        _id: '5cfd81600000000000000002',
        firstname: 'Enora',
        lastname: 'PLIRA',
        email: 'enora.plira@acme.com',
        active: false
      })

      done()
    })

    afterAll(() => {
      return User.deleteMany({})
    })

    it('should get only user lastname field', () => {
      const query = {
        $select: 'lastname'
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body[0].lastname).toBe('DOE')
          expect(response.body[0].firstname).toBeUndefined()
        })
    })

    it('should get one user with specific email', () => {
      const query = {
        $conditions: {
          email: 'john.doe@acme.com'
        }
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
          expect(response.body[0].lastname).toBe('DOE')
        })
    })

    it('should get one user with specific email and display only the lastname', () => {
      const query = {
        $conditions: {
          email: 'john.doe@acme.com'
        },
        $select: 'lastname'
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
          expect(response.body[0].lastname).toBe('DOE')
          expect(response.body[0].email).toBeUndefined()
        })
    })

    it('should get users reverse sorting by lastname', () => {
      const query = {
        $sort: '-lastname'
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(3)
          expect(response.body[0].lastname).toBe('SMITH')
        })
    })

    it('should get only one user by limit', () => {
      const query = {
        $limit: 1
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
          expect(response.body[0].lastname).toBe('DOE')
        })
    })

    it('should get only one user by limit and reverse sorting by lastname', () => {
      const query = {
        $limit: 1,
        $sort: '-lastname'
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
          expect(response.body[0].lastname).toBe('SMITH')
        })
    })

    it('should get users by conditions and reverse sorting by lastname', () => {
      const query = {
        $sort: '-lastname',
        $conditions: {
          active: true
        }
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(2)
          expect(response.body[0].lastname).toBe('SMITH')
        })
    })

    it('should get one user sort by lastname after an offset of 2', () => {
      const query = {
        $skip: 2,
        $sort: 'lastname'
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1)
          expect(response.body[0].lastname).toBe('SMITH')
        })
    })

    it("should get 400 error when conditions isn't JSON", () => {
      return request(app)
        .get('/api/users?$conditions=isnotjson')
        .set('Accept', 'application/json')
        .expect(400)
    })
  })
})

/**
 * Try advanced system like
 * - populate
 *
 */
describe('Mongoose: GET /api/cars & GET /api/users', () => {
  beforeAll(async done => {
    mongoServer = await db(mongoose)
    done()
  })

  afterAll(async done => {
    await mongoose.disconnect()
    await mongoServer.stop()
    done()
  })

  describe('With subdocuments wanted to be populate', () => {
    beforeAll(() => {
      return Promise.all([
        // Users
        User.create({
          _id: '5cfd81600000000000000000',
          firstname: 'John',
          lastname: 'DOE',
          email: 'john.doe@acme.com',
          active: true,
          cars: ['5cfd81600000000000000100']
        }),
        User.create({
          _id: '5cfd81600000000000000001',
          firstname: 'Alan',
          lastname: 'SMITH',
          email: 'alan.smith@acme.com',
          active: true,
          cars: ['5cfd81600000000000000101', '5cfd81600000000000000103']
        }),
        User.create({
          _id: '5cfd81600000000000000002',
          firstname: 'Enora',
          lastname: 'PLIRA',
          email: 'enora.plira@acme.com',
          active: false
        }),

        // Brands
        Brand.create({
          _id: '5cfd81600000000000000200',
          name: 'MERCEDES'
        }),
        Brand.create({
          _id: '5cfd81600000000000000201',
          name: 'RENAULT'
        }),

        // Cars
        Car.create({
          _id: '5cfd81600000000000000100',
          license: 'AG-810-NC',
          brand: '5cfd81600000000000000200',
          user: '5cfd81600000000000000000'
        }),
        Car.create({
          _id: '5cfd81600000000000000101',
          license: 'EX-090-EE',
          brand: '5cfd81600000000000000201',
          user: '5cfd81600000000000000001'
        }),
        Car.create({
          _id: '5cfd81600000000000000103',
          license: 'IK-711-AP',
          brand: '5cfd81600000000000000200',
          user: '5cfd81600000000000000001'
        }),
        Car.create({
          _id: '5cfd81600000000000000104',
          license: 'XX-465-CV',
          brand: '5cfd81600000000000000201'
        })
      ])
    })

    afterAll(() => {
      return Promise.all([User.deleteMany({}), Car.deleteMany({}), Brand.deleteMany({})])
    })

    it('should get cars list without brand property populated', () => {
      const query = {}

      return request(app)
        .get('/api/cars' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(4)
        })
    })

    it('should get cars list with brand property populated', () => {
      const query = {
        $populate: 'brand'
      }

      return request(app)
        .get('/api/cars' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(4)
          expect(response.body[0].brand).toHaveProperty('name', 'MERCEDES')
        })
    })

    it('should get users with cars array and brand for each populated', () => {
      const query = {
        $populate: 'cars.brand'
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(3)
          expect(response.body[0].cars[0]).toHaveProperty('license', 'AG-810-NC')
        })
    })

    it('should get car populated with specific user', () => {
      const query = {
        $populate: 'cars.brand'
      }

      return request(app)
        .get('/api/users/5cfd81600000000000000001' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body.cars[0]).toHaveProperty('license', 'EX-090-EE')
          expect(response.body.cars[0].brand).toHaveProperty('name', 'RENAULT')
        })
    })

    it('should populate with conditions and limits', () => {
      const query = {
        $populate: 'cars.brand',
        $conditions: {
          email: 'alan.smith@acme.com'
        },
        $select: 'lastname cars'
      }

      return request(app)
        .get('/api/users' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body[0].lastname).toBe('SMITH')
          expect(response.body[0].firstname).toBeUndefined()
          expect(response.body[0].cars).toHaveLength(2)
          expect(response.body[0].cars[0].brand).toHaveProperty('name', 'RENAULT')
        })
    })
  })
})

describe('Mongoose: GET /api/users (with custom routes)', () => {
  beforeAll(async done => {
    mongoServer = await db(mongoose)
    done()
  })

  afterAll(async done => {
    await mongoose.disconnect()
    await mongoServer.stop()
    done()
  })

  describe('Add route to existing ones', () => {
    beforeAll(async done => {
      await User.create({
        _id: '5cfd81600000000000000000',
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true
      })

      await User.create({
        _id: '5cfd81600000000000000001',
        firstname: 'Alan',
        lastname: 'SMITH',
        email: 'alan.smith@acme.com',
        active: true
      })

      await User.create({
        _id: '5cfd81600000000000000002',
        firstname: 'Enora',
        lastname: 'PLIRA',
        email: 'enora.plira@acme.com',
        active: false
      })

      done()
    })

    afterAll(() => {
      return User.deleteMany({})
    })

    it('should get values on custom route', () => {
      const query = {
        $select: 'lastname'
      }

      return request(app)
        .get('/api/users/me' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(true).toBe(true)
        })
    })
  })
})
