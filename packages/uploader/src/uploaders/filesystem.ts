import { createWriteStream, ensureDirSync } from 'fs-extra'
import * as path from 'path'
import * as process from 'process'
import { Readable } from 'stream'

import { Uploader } from '../uploader'

export class FileSystemUploader extends Uploader {
  public uploadTarget: string | Function

  constructor(options: FileSystemOptions) {
    super()

    this.uploadTarget = options.uploadTarget
  }

  /**
   *
   */
  public onFileHandler(fieldname: string, file: Readable, filename: string, encoding: string, mimetype: string): void {
    const key = this.generateKey()
    const storagePath = path.join(this.storagePath, key)
    file.pipe(createWriteStream(storagePath))
  }

  /**
   *
   */
  private get storagePath() {
    const pathWithoutItem = path.join(
      process.cwd(),
      typeof this.uploadTarget === 'function' ? this.uploadTarget() : this.uploadTarget
    )

    ensureDirSync(pathWithoutItem, 0x2775)

    return pathWithoutItem
  }
}

export interface FileSystemOptions {
  uploadTarget: string | Function
}
