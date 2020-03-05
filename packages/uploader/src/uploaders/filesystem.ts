import { createWriteStream, ensureDirSync, createReadStream } from 'fs-extra'
import * as path from 'path'
import * as process from 'process'
import { Readable } from 'stream'
import * as mime from 'mime-types'

import { Uploader } from '../uploader'

export class FileSystemUploader extends Uploader {
  private uploadTarget: string | Function
  private preserveExtension: boolean

  constructor(options: FileSystemOptions) {
    super()

    this.uploadTarget = options.uploadTarget
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
    const { path, key } = this.generateStoragePath(mimetype)
    file.pipe(createWriteStream(path))
    return key
  }

  /**
   *
   * @param key
   */
  public getStreamFile(key: string): Readable {
    return createReadStream(this.retrieveKeyPath(key))
  }

  /**
   *
   */
  public onFileDeleteHandler(key: string): void {
    throw new Error('Method not implemented.')
  }

  /**
   *
   */
  private generateStoragePath(mimetype: string) {
    //
    const extension = mime.extension(mimetype)

    //
    const pathWithoutItem = path.join(
      process.cwd(),
      typeof this.uploadTarget === 'function' ? this.uploadTarget() : this.uploadTarget
    )

    //
    ensureDirSync(pathWithoutItem, 0x0777)

    //
    const key = this.generateKey().toString() + (this.preserveExtension && extension ? `.${extension}` : '')

    //
    return {
      path: path.join(pathWithoutItem, key),
      key
    }
  }

  /**
   *
   * @param key
   */
  private retrieveKeyPath(key: string) {
    const pathWithoutItem = path.join(
      process.cwd(),
      typeof this.uploadTarget === 'function' ? this.uploadTarget() : this.uploadTarget
    )

    return path.join(pathWithoutItem, key)
  }
}

export interface FileSystemOptions {
  uploadTarget: string | Function
  preserveExtension?: boolean
}
