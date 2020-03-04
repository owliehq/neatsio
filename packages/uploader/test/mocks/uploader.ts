import { FileSystemUploader } from '../../src'

const uploadTarget = () => {
  return `./test/uploads`
}

const uploader = new FileSystemUploader({ uploadTarget })

export { uploader }
