import * as express from 'express'
import asyncWrapper from '../../src/async-wrapper'

const app = express()

const getUsers = () =>
  new Promise((resolve, reject) => {
    resolve([
      {
        id: 1,
        firstname: 'Jean',
        lastname: 'MICHEL'
      },
      {
        id: 2,
        firstname: 'Mira',
        lastname: 'CASTOR'
      }
    ])
  })

// Get as async RequestHandler
const userRoute = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const users = await getUsers()
  res.status(200).json(users)
}

// With async
app.get('/users', asyncWrapper(userRoute))

// Without async
app.get('/cars', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(200).json([{ name: 'RENAULT' }, { name: 'ASTON MARTIN' }, { name: 'BMW' }])
})

export { app }
