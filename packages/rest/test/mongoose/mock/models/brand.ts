import * as mongoose from 'mongoose'

/**
 *
 */
const BrandSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    id: true,
    versionKey: false
  }
)

export default mongoose.model('Brand', BrandSchema)
