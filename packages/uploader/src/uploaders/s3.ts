import * as mime from 'mime-types'
import { Readable } from 'stream'
import { Uploader } from '../uploader'

export class S3Uploader extends Uploader {
  private bucket: any
  private bucketName: string
  private folderName: string

  constructor(options: S3Options) {
    super()
    this.bucket = options.bucket
    this.bucketName = options.bucketName
    this.folderName = options.folderName
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

    const key = `${this.generateKey().toString()}.${extension}`

    const params = {
      Bucket: this.bucketName,
      Key: `${this.folderName}/${key}`,
      Body: file
    }

    const data = this.bucket.upload(params, (err: any, data: any) => {
      if (err) {
        console.log('err', err)
      }
    })

    return key
  }

  /**
   *
   * @param key
   */
  public getStreamFile(key: string): Readable {
    const params = { Bucket: this.bucketName, Key: `${this.folderName}/${key}` }

    return this.bucket.getObject(params).createReadStream()
  }

  /**
   *
   */
  public onFileDeleteHandler(key: string): void {
    throw new Error('Method not implemented.')
  }
}

export interface S3Options {
  bucket: any
  bucketName: string
  folderName: string
}
