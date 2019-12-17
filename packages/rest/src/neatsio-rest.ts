import Orchestrator from './orchestrator'
import * as mongoose from 'mongoose'

mongoose.plugin(require('mongoose-deep-populate')(mongoose))

const orchestrator = new Orchestrator()

export default orchestrator
