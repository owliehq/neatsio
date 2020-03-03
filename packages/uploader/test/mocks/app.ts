import { Request, Response } from 'express'
import * as express from 'express'
import * as bodyParser from 'body-parser'

import { FileSystemUploader } from '../../src'

const uploadTarget = () => {
  const random = Math.round(Math.random() * 100)
    .toString()
    .padStart(2)

  return `./test/uploads/${random}`
}

const uploader = new FileSystemUploader({ uploadTarget })

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/files', [uploader.middleware], (req: Request, res: Response) => {
  console.log(req.body)
  res.status(200).send({ ok: 'ok' })
})

const errorMiddleware: express.ErrorRequestHandler = (err, req, res) => {
  console.error(err)
  res.send('FU')
}

app.use(errorMiddleware)

export { app }
