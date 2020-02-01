import * as request from 'supertest'
import * as qs from 'query-string'
import * as fs from 'fs'
import * as path from 'path'

import app from '../mocks/app'
import sequelize from '../mocks/db'

import User from '../mocks/models/user'
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

describe('Sequelize: Options model tests', () => {
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

  describe('Hidden properties', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true })

      await User.create({
        firstname: 'John',
        lastname: 'DOE',
        email: 'john.doe@acme.com',
        active: true
      })

      await Article.create({
        name: '1st article',
        notation: 5,
        userId: 1
      })

      await Article.create({
        name: '2nd article',
        notation: 3,
        userId: 1
      })

      await Article.create({
        name: '3rd article',
        notation: 1,
        userId: 1
      })
    })

    afterAll(async () => {
      await User.destroy({ where: {}, truncate: true, restartIdentity: true })
      await Article.destroy({ where: {}, truncate: true, restartIdentity: true })
    })

    it('should return articles without notation', () => {
      return request(app)
        .get('/api/articles')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(3)
          expect(response.body[0].notation).toBeUndefined()
          expect(response.body[0].name).toBe('1st article')
        })
    })

    it('should return populated articles without notation on user', () => {
      const query = {
        $populate: 'articles'
      }

      return request(app)
        .get('/api/users/1' + stringify(query))
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.body.articles).toHaveLength(3)
          expect(response.body.articles[0].notation).toBeUndefined()
          expect(response.body.articles[0].name).toBe('1st article')
        })
    })
  })
})
