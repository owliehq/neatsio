import { Request, Response } from 'express'
import * as express from 'express'
import * as bodyParser from 'body-parser'

import { uploader } from '../uploader'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/files', [uploader.middleware], (req: Request, res: Response) => {
  res.status(200).json(req.body)
})

const errorMiddleware: express.ErrorRequestHandler = (err, req, res) => {
  console.error(err)
  res.send('FU')
}

app.use(errorMiddleware)

export { app }
