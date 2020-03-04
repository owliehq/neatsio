import { Readable } from 'stream'
import { Uploader } from '../uploader'

export class FirebaseUploader extends Uploader {
  onFileDeleteHandler(key: string): void {
    throw new Error('Method not implemented.')
  }
  onFileUploadHandler(fieldname: string, file: Readable, filename: string, encoding: string, mimetype: string): void {
    throw new Error('Method not implemented.')
  }
}
