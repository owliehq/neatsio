import { Readable } from 'stream'
import * as Busboy from 'busboy'
import { RequestHandler } from 'express'
import { foid } from './utils'

export abstract class Uploader {
  constructor() {}

  /**
   *
   */
  public get middleware(): RequestHandler {
    const handler: RequestHandler = (req, res, next) => {
      const busboy = new Busboy({ headers: req.headers })

      //
      busboy.on('file', (fieldname: string, file: Readable, filename: string, encoding: string, mimetype: string) => {
        const key = this.onFileUploadHandler(fieldname, file, filename, encoding, mimetype)

        file.on('end', () => {
          req.body[fieldname] = key
        })
      })

      //
      busboy.on('field', (key, value) => {
        req.body[key] = value
      })

      //
      busboy.on('finish', next)

      //
      req.body = req.body || {}

      //
      req.pipe(busboy)
    }

    return handler
  }

  /**
   *
   */
  public get downloadHandler(): RequestHandler {
    const handler: RequestHandler = (req, res) => {
      const { key } = req.params

      const stream = this.getStreamFile(key)

      stream.pipe(res)
    }

    return handler
  }

  /**
   *
   */
  abstract onFileUploadHandler(
    fieldname: string,
    file: Readable,
    filename: string,
    encoding: string,
    mimetype: string
  ): string

  /**
   *
   */
  abstract onFileDeleteHandler(key: string): void

  /**
   *
   */
  abstract getStreamFile(key: string): Readable

  /**
   *
   */
  protected generateKey() {
    return foid(18)
  }
}
