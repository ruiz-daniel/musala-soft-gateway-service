const peripheralModel = require('../models/peripheral')

/**
 * @param {Object} peripheral
 * @throws {Error}
 */
module.exports.handler = {
  async create(peripheral) {
    if (!peripheral) throw new Error('Missing peripheral')

    await peripheralModel.create(peripheral)
  },
  async get() {
    const result = await peripheralModel.find()
    return result
  },
}
