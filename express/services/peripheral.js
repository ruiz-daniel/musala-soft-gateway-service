const peripheralModel = require('../models/peripheral')
const crypto = require('crypto')

/**
 * @param {Object} peripheral
 * @throws {Error}
 */
module.exports.handler = {
  async create(peripheral) {
    if (!peripheral) throw new Error('Missing peripheral')

    const result = await peripheralModel.create(peripheral)
    return result
  },
  async get() {
    const result = await peripheralModel.find()
    return result
  },

  async find(id) {
    const result = await peripheralModel.findById(id)
    return result
  },

  // http patch update
  async update(peripheral) {
    if (!peripheral) throw new Error('Missing peripheral')

    let result = await peripheralModel.findByIdAndUpdate(peripheral._id, peripheral)
    result = await peripheralModel.findById(peripheral._id)
    return result
  },
  
  // http put update
  async updateOverride(peripheral) {
    if (!peripheral) throw new Error('Missing peripheral')

    const doc = await peripheralModel.findOne({_id: peripheral._id})

    doc.overwrite(peripheral)
    const result = await doc.save()
    return result
  },

  async delete(id) {
    const result = await peripheralModel.findByIdAndDelete(id)
    return result
  }
}
