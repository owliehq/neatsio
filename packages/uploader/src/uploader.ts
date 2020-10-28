import { Readable } from 'stream'
import * as Busboy from 'busboy'
import { RequestHandler } from 'express'
import { foid } from './utils'
import { asyncWrapper } from '@owliehq/async-wrapper'
import { HttpError } from '@owliehq/http-errors'

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
  public buildDownloadEndpoint(options: DownloadEndpointOptions): RequestHandler {
    const handler: RequestHandler = async (req, res) => {
      const key = await options.retrieveKeyCallback(req.params.id)

      if (!key) throw HttpError.NotFound()

      const stream = this.getStreamFile(key)

      // TODO: Better handling needed here
      res.attachment(options?.filename || key)
      stream.pipe(res)
    }

    return asyncWrapper(handler)
  }

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

/**
 *
 */
export interface DownloadEndpointOptions {
  filename?: string
  retrieveKeyCallback(id: string): Promise<string>
}
