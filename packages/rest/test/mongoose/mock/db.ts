import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'

export default async (mongoose: Mongoose) => {
  const mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getConnectionString()

  mongoose.set('useUnifiedTopology', true);

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true }, err => {
    if (err) console.error(err)
  })

  return mongoServer
}
