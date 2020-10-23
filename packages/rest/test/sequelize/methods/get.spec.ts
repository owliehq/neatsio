import * as request from 'supertest'
import * as qs from 'query-string'
import * as fs from 'fs'
import * as path from 'path'

import app from '../mocks/app'
import sequelize from '../mocks/db'

import User from '../mocks/models/user'
import Car from '../mocks/models/car'
import Brand from '../mocks/models/brand'
import Role from '../mocks/models/role'
import Team from '../mocks/models/team'
import Article from '../mocks/models/article'

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

describe('Sequelize: GET Method & Routes', () => {
  //
  beforeAll(async done => {
    await sequelize.authenticate()

    await sequelize.sync({ force: true })

    done()
  })

  //
  afterAll(async done => {
    await sequelize.close()

    try {
      fs.unlinkSync(path.join(__dirname, '../mocks', 'database.sqlite'))
    } catch (err) {
      console.error(err)
    }

    done()
  })

  describe('GET /api/users', () => {
    /**
     * TESTS :
     * - init collections routes
     * - naming collections routes
     */
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

    /**
     * TESTS :
     * - basic GET tests with one user
     */
    describe('With one entry', () => {
      beforeAll(() => {
        return User.create({
          firstname: 'John',
          lastname: 'DOE',
          email: 'john.doe@acme.com'
        })
      })

      afterAll(() => {
        return User.destroy({ where: {}, truncate: true, restartIdentity: true })
      })

      it('should get one user on an array', () => {
        return request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(1)
            expect(response.body[0].id).toBe(1)
            expect(response.body[0].lastname).toBe('DOE')
            expect(response.body[0].firstname).toBe('John')
            expect(response.body[0].email).toBe('john.doe@acme.com')
          })
      })

      it('should get user by id', () => {
        return request(app)
          .get('/api/users/1')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body.id).toBe(1)
            expect(response.body.lastname).toBe('DOE')
          })
      })

      it("should return an 404 HTTP error when user doesn't exist", () => {
        return request(app)
          .get('/api/users/2')
          .set('Accept', 'application/json')
          .expect(404)
      })
    })

    /**
     * TESTS :
     * - conditions
     * - restrictives fields
     * - sorting
     * - pagination
     */
    describe('With some entries to conditionals & restrictive tests', () => {
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

            expect(response.body[1].lastname).toBe('SMITH')
            expect(response.body[1].firstname).toBeUndefined()
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

      it('should return two users via $or condition with specific email and display only the lastname', () => {
        const query = {
          $conditions: {
            $or: [{ email: 'john.doe@acme.com' }, { email: 'enora.plira@acme.com' }]
          },
          $select: 'lastname'
        }

        return request(app)
          .get('/api/users' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(2)
          })
      })

      it('should get count value via /count request with conditions', () => {
        const query = {
          $conditions: {
            $or: [{ email: 'john.doe@acme.com' }, { email: 'enora.plira@acme.com' }]
          }
        }

        return request(app)
          .get('/api/users/count' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toBe(2)
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

  describe('GET /api/cars', () => {
    /**
     * TESTS :
     * - simple populating
     * - deep populating
     * - different type association with populating
     * - conditions, filtering, paginate with populating
     */
    describe('With subdocuments wanted to be populate', () => {
      beforeAll(async () => {
        await sequelize.sync({ force: true })

        await Brand.create({
          name: 'RENAULT'
        })

        await Role.create({
          name: 'Member'
        })

        await Role.create({
          name: 'Admin',
          write: true
        })

        await User.create(
          {
            firstname: 'John',
            lastname: 'DOE',
            email: 'john.doe@acme.com',
            active: true,
            roleId: 1,
            cars: [
              {
                license: 'EX-090-EE',
                brandId: 1
              },
              {
                license: 'AG-910-NC',
                brandId: 1
              }
            ]
          },
          {
            include: [Car]
          }
        )

        await User.create({
          firstname: 'Alan',
          lastname: 'SMITH',
          roleId: 1,
          email: 'alan.smith@acme.com',
          active: true
        })

        await User.create(
          {
            firstname: 'Enora',
            lastname: 'PLIRA',
            email: 'enora.plira@acme.com',
            active: false,
            roleId: 2,
            cars: [
              {
                license: 'AZ-018-AA',
                brandId: 1
              },
              {
                license: 'DB-950-59',
                brandId: 1
              }
            ]
          },
          {
            include: [Car]
          }
        )
      })

      afterAll(async () => {
        await User.destroy({ where: {}, truncate: true, restartIdentity: true })

        await Brand.destroy({ where: {}, truncate: true, restartIdentity: true })

        await Car.destroy({ where: {}, truncate: true, restartIdentity: true })

        await Role.destroy({ where: {}, truncate: true, restartIdentity: true })
      })

      it('should return all cars without user populated', () => {
        return request(app)
          .get('/api/cars')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(4)
          })
      })

      it('should return all cars with only user field populated', () => {
        const query = {
          $populate: 'user'
        }

        return request(app)
          .get('/api/cars' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(4)
            expect(response.body[0].user.lastname).toBe('DOE')
            expect(response.body[0].brand).toBeUndefined()
          })
      })

      it('should return all cars with all fields populated', () => {
        const query = {
          $populate: 'user brand'
        }

        return request(app)
          .get('/api/cars' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(4)
            expect(response.body[0].user.lastname).toBe('DOE')
            expect(response.body[0].brand.name).toBe('RENAULT')
          })
      })

      it('should return all users without cars populated', () => {
        return request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(3)
            expect(response.body[0].cars).toBeUndefined()
            expect(response.body[1].cars).toBeUndefined()
            expect(response.body[2].cars).toBeUndefined()
          })
      })

      it('should return all users with cars populated', () => {
        const query = {
          $populate: 'cars'
        }

        return request(app)
          .get('/api/users' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(3)
            expect(response.body[0].cars).toHaveLength(2)
            expect(response.body[0].cars[0].license).toBe('EX-090-EE')
          })
      })

      it('should return all users with cars populated when same variable is used in querystring', () => {
        const query = {
          $populate: 'cars cars'
        }

        return request(app)
          .get('/api/users' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(3)
            expect(response.body[0].cars).toHaveLength(2)
            expect(response.body[0].cars[0].license).toBe('EX-090-EE')
          })
      })

      it('should return all users with cars populated and car brand subpopulated', () => {
        const query = {
          $populate: 'cars.brand'
        }

        return request(app)
          .get('/api/users' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(3)
            expect(response.body[0].cars).toHaveLength(2)
            expect(response.body[0].cars[0].license).toBe('EX-090-EE')
            expect(response.body[0].cars[0].brand.name).toBe('RENAULT')
          })
      })

      it('shoud return user with cars & role populated and car brand subpopulated', () => {
        const query = {
          $populate: 'cars.brand role'
        }

        return request(app)
          .get('/api/users' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(3)

            expect(response.body[0].cars).toHaveLength(2)
            expect(response.body[0].cars[0].license).toBe('EX-090-EE')
            expect(response.body[0].cars[0].brand.name).toBe('RENAULT')

            expect(response.body[0].role.name).toBe('Member')
          })
      })

      it('should return user at the middle by lastname DESC with cars populated and car brand subpopulated', () => {
        const query = {
          $limit: 1,
          $sort: '-lastname',
          $populate: 'cars.brand',
          $skip: 1
        }

        return request(app)
          .get('/api/users' + stringify(query))
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(1)

            expect(response.body[0].cars).toHaveLength(2)
            expect(response.body[0].cars[0].license).toBe('AZ-018-AA')
            expect(response.body[0].cars[0].brand.name).toBe('RENAULT')

            expect(response.body[0].role).toBeUndefined()
          })
      })
    })
  })

  describe('GET /api/roles', () => {
    /**
     * TESTS :
     * - restrictive middlewares defined on specific model
     */
    describe('Restrictive usage by middlewares', () => {
      beforeAll(async () => {
        await sequelize.sync({ force: true })

        await Role.create({
          name: 'Member'
        })

        await Role.create({
          name: 'Admin',
          write: true
        })

        await User.create({
          firstname: 'John',
          lastname: 'DOE',
          email: 'john.doe@acme.com',
          active: true,
          roleId: 1
        })

        await User.create({
          firstname: 'John',
          lastname: 'DOE',
          email: 'john.doe@acme.com',
          active: true,
          roleId: 2
        })
      })

      afterAll(async () => {
        await User.destroy({ where: {}, truncate: true, restartIdentity: true })

        await Role.destroy({ where: {}, truncate: true, restartIdentity: true })
      })

      it('should return 401 because authorization header is needed', () => {
        return request(app)
          .get('/api/roles')
          .set('Accept', 'application/json')
          .expect(401)
      })

      it('should return 403 because authorization header need to be authorized one', () => {
        return request(app)
          .get('/api/roles')
          .set('Accept', 'application/json')
          .set('Authorization', 'notOkToken')
          .expect(403)
      })
    })
  })

  describe('GET /api/teams', () => {
    describe('Before middleware', () => {
      beforeAll(async () => {
        await sequelize.sync({ force: true })

        await Team.create({
          name: 'Administrators'
        })

        await Team.create({
          name: 'Sales'
        })

        await Team.create({
          name: 'HR'
        })
      })

      afterAll(async () => {
        await Team.destroy({ where: {}, truncate: true, restartIdentity: true })
      })

      it('should return all teams', () => {
        return request(app)
          .get('/api/teams')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(3)
          })
      })

      it('should return a 401 on get one team without token', () => {
        return request(app)
          .get('/api/teams/1')
          .set('Accept', 'application/json')
          .expect(401)
      })

      it('should return team with correct token', () => {
        return request(app)
          .get('/api/teams/1')
          .set('Accept', 'application/json')
          .set('Authorization', 'abc')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('Administrators')
          })
      })
    })
  })

  /*describe('GET /api/articles', () => {
    describe('Deleted values', () => {
      beforeAll(async () => {
        await sequelize.sync({ force: true })


        await Article.create({
          name: 'News 1',
          notation: 12
        })

        await Article.create({
          name: 'News 2',
          notation: 5
        })
      })

      afterAll(async () => {
        await Article.destroy({ where: {}, truncate: true, restartIdentity: true })
      })

      it('should return first article without notation field', () => {
        return request(app)
          .get('/api/articles/1')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body.name).toBe('News 1')
            expect(response.body.notation).toBeUndefined()
          })
      })

      it('should return all articles without notation field', () => {
        return request(app)
          .get('/api/articles')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(2)
            expect(response.body[0].name).toBe('News 1')
            expect(response.body[0].notation).toBeUndefined()
          })
      })
    })
  })*/

  /*describe('GET /api/users/{id}/{associatedModel}', () => {
    describe('With HasMany relationship', () => {
      beforeAll(async () => {

        await sequelize.sync({ force: true })


        await Brand.create({
          name: 'RENAULT'
        })


        await Role.create({
          name: 'Member'
        })


        await Role.create({
          name: 'Admin',
          write: true
        })


        await User.create(
          {
            firstname: 'John',
            lastname: 'DOE',
            email: 'john.doe@acme.com',
            active: true,
            roleId: 1,
            cars: [
              {
                license: 'EX-090-EE',
                brandId: 1
              },
              {
                license: 'EX-090-EE',
                brandId: 1
              }
            ]
          },
          {
            include: [Car]
          }
        )


        await User.create({
          firstname: 'Alan',
          lastname: 'SMITH',
          roleId: 1,
          email: 'alan.smith@acme.com',
          active: true
        })


        await User.create(
          {
            firstname: 'Enora',
            lastname: 'PLIRA',
            email: 'enora.plira@acme.com',
            active: false,
            roleId: 2,
            cars: [
              {
                license: 'AZ-018-AA',
                brandId: 1
              },
              {
                license: 'DB-950-59',
                brandId: 1
              }
            ]
          },
          {
            include: [Car]
          }
        )
      })

      afterAll(async () => {

        await User.destroy({ where: {}, truncate: true, restartIdentity: true })


        await Car.destroy({ where: {}, truncate: true, restartIdentity: true })


        await Brand.destroy({ where: {}, truncate: true, restartIdentity: true })


        await Role.destroy({ where: {}, truncate: true, restartIdentity: true })
      })

      it('should return cars of the first user', () => {
        return request(app)
          .get('/api/users/1/cars')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            expect(response.body).toHaveLength(2)
          })
      })
    })
  })*/
})
