import * as mongoose from 'mongoose'

/**
 *
 */
const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    firstname: {
      type: String,
      required: true
    },

    lastname: {
      type: String,
      required: true
    },

    active: {
      type: Boolean,
      required: false
    },

    cars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
      }
    ],

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }
  },
  {
    id: true,
    versionKey: false
  }
)

export default mongoose.model('User', UserSchema)
