import * as mongoose from 'mongoose'
import * as sequelize from 'sequelize'

import MongooseService from '../services/mongoose-service'
import SequelizeService from '../services/sequelize-service'

export type NeatsioModel<M> = MongooseModel | SequelizeModel<M>
export type MongooseModel = mongoose.Model<any>
export type SequelizeModel<M> = { new (): M } & typeof sequelize.Model

export default {
  /**
   *
   * @param model
   */
  getServiceFromModel<M extends sequelize.Model>(model: NeatsioModel<M>) {
    return model.prototype instanceof mongoose.Model
      ? new MongooseService(model as MongooseModel)
      : new SequelizeService(model as SequelizeModel<M>)
  }
}
