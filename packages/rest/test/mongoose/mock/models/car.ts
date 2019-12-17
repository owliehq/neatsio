import * as mongoose from 'mongoose'

/**
 *
 */
const CarSchema: mongoose.Schema = new mongoose.Schema(
  {
    license: {
      type: String,
      required: true
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    id: true,
    versionKey: false
  }
)

export default mongoose.model('Car', CarSchema)
