import * as mongoose from 'mongoose'

const RoleSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    write: {
      type: Boolean,
      default: false
    }
  },

  {
    id: true,
    versionKey: false
  }
)

export default mongoose.model('Role', RoleSchema)
