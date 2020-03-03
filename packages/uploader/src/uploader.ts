import { Readable } from 'stream'
import * as Busboy from 'busboy'
import { RequestHandler } from 'express'
import { v4 as uuidv4 } from 'uuid'

export abstract class Uploader {
  constructor() {}

  /**
   *
   */
  public get middleware(): RequestHandler {
    const handler: RequestHandler = (req, res, next) => {
      const busboy = new Busboy({ headers: req.headers })

      //
      busboy.on('file', this.onFileHandler.bind(this))

      //
      busboy.on('field', (key, value) => {
        req.body[key] = value
      })

      //
      busboy.on('finish', next)

      //
      req.body = req.body || {}

      req.pipe(busboy)
    }

    return handler
  }

  /**
   *
   */
  abstract onFileHandler(fieldname: string, file: Readable, filename: string, encoding: string, mimetype: string): void

  /**
   *
   */
  protected generateKey() {
    return uuidv4()
  }
}
