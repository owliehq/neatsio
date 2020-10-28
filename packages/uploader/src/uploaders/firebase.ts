import { Readable } from 'stream'
import * as mime from 'mime-types'

import { Uploader } from '../uploader'
import { HttpError } from '@owliehq/http-errors'

export class FirebaseUploader extends Uploader {
  private bucket: any
  private preserveExtension: boolean

  constructor(options: FirebaseOptions) {
    super()

    this.bucket = options.bucket
    this.preserveExtension = options.preserveExtension ?? true
  }

  /**
   *
   */
  public onFileUploadHandler(
    fieldname: string,
    file: Readable,
    filename: string,
    encoding: string,
    mimetype: string
  ): string {
    const extension = mime.extension(mimetype)

    const key = this.generateKey().toString() + (this.preserveExtension && extension ? `.${extension}` : '')

    const fileUpload = this.bucket.file(key)

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: mimetype
      }
    })

    file.pipe(blobStream)

    return key
  }

  /**
   *
   * @param key
   */
  public getStreamFile(key: string): Readable {
    try {
      return this.bucket.file(key).createReadStream()
    } catch (err) {
      throw HttpError.NotAcceptable(`Error with Google Storage...`)
    }
  }

  /**
   *
   */
  public onFileDeleteHandler(key: string): void {
    throw new Error('Method not implemented.')
  }
}

export interface FirebaseOptions {
  bucket: any
  preserveExtension?: boolean
}
