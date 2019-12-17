import * as mongoose from 'mongoose'

/**
 *
 */
const PeopleSchema: mongoose.Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    }
  },

  {
    id: true,
    versionKey: false
  }
)

export default mongoose.model('People', PeopleSchema)
