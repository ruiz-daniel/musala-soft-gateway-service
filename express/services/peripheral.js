const gatewayModel = require('../models/peripheral')

/**
 * @param {Object} peripheral
 * @throws {Error}
 */
module.exports.create = async (peripheral) => {
  if (!peripheral) throw new Error('Missing peripheral')

  await gatewayModel.create(peripheral)
}
