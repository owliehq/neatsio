import { Request, Response } from 'express'
import * as express from 'express'
import * as bodyParser from 'body-parser'

import admin from 'firebase-admin'

import * as dotenv from 'dotenv'
dotenv.config()

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

const bucket = admin.storage().bucket(process.env.FIREBASE_BUCKET)

import { FirebaseUploader } from '../../../src/uploaders/firebase'

const uploader = new FirebaseUploader({
  bucket
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/files', [uploader.middleware], (req: Request, res: Response) => {
  res.status(200).json(req.body)
})

app.get(
  '/files/:id',
  uploader.buildDownloadEndpoint({
    filename: 'image.png',
    async retrieveKeyCallback(key) {
      return 'llxlhjcdi82ys0u25d.markdown'
    }
  })
)

const errorMiddleware: express.ErrorRequestHandler = (err, req, res) => {
  console.error(err)
  res.send('FU')
}

app.use(errorMiddleware)

export { app }
