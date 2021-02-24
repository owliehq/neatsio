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

      const { cache, contentType } = options

      if (cache && Object.keys(cache).length) {
        cache.maxAge = cache.maxAge || 86400

        res.set('Cache-Control', `public, max-age=${cache.maxAge}`)
        res.setHeader('Expires', new Date(Date.now() + cache.maxAge).toUTCString())
      }

      if (contentType) {
        res.set({ 'Content-Type': contentType })
      } else {
        // TODO: Better handling needed here
        res.attachment(options?.filename || key)
      }

      const promise = () =>
        new Promise((resolve, reject) => {
          const stream = this.getStreamFile(key)

          stream.on('error', (err: any) => {
            if (err.code === 404) return reject(HttpError.NotFound())
            reject(HttpError.InternalServerError())
          })

          stream.on('finish', () => resolve(void 0))

          stream.pipe(res)
        })

      try {
        await promise()
      } catch (err) {
        console.log('An error has occured during downloading file...')
        throw HttpError.UnprocessableEntity()
      }
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
  contentType?: string
  cache?: {
    maxAge?: number
  }
  retrieveKeyCallback(id: any): Promise<string | undefined>
}
