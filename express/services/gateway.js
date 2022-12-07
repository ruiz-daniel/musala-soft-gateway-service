const gatewayModel = require('../models/gateway')

/**
 * @param {Object} gateway
 * @throws {Error}
 */
module.exports.handler = {
  async create(gateway) {
    if (!gateway) throw new Error('Missing gateway')

    await gatewayModel.create(gateway)
  },
  async get() {
    const result = await gatewayModel.find().populate("peripherals")
    return result
  },
  async update(gateway) {
    if (!gateway) throw new Error('Missing gateway')

    await gatewayModel.updateOne(gateway)
  }
}
