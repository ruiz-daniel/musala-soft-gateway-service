const mongoose = require('mongoose')
const crypto = require('crypto')
const gatewayModel = require('../models/gateway')
const peripheralService = require('./peripheral')
/**
 * @param {Object} gateway
 * @throws {Error}
 */
module.exports.handler = {
  async create(gateway) {
    if (!gateway) throw new Error('Missing gateway')

    if (gateway.peripherals?.length && gateway.peripherals?.length <= 10) {
      gateway.peripherals.forEach(async (element) => {
        // automatically create peripherals
        if (!element._id) {
          element.uid = crypto.randomUUID()
          element._id = new mongoose.Types.ObjectId()
          await peripheralService.handler.create(element)
        }
      })
    } else if (gateway.peripherals?.length > 10) {
      throw new Error('A gateway cannot have more than 10 peripherals')
    }

    await gatewayModel.create(gateway)
  },
  async get() {
    const result = await gatewayModel.find().populate('peripherals')
    return result
  },

  async find(id) {
    const result = await gatewayModel.findById(id).populate('peripherals')
    return result
  },

  // http patch update
  async update(gateway) {
    if (!gateway) throw new Error('Missing gateway')

    if (gateway.peripherals?.length > 10) {
      throw new Error('A gateway cannot have more than 10 peripherals')
    }
    const result = await gatewayModel.findByIdAndUpdate(gateway._id, gateway)
    return result
  },
  
  // http put update
  async updateOverride(gateway) {
    if (!gateway) throw new Error('Missing gateway')

    if (gateway.peripherals?.length > 10) {
      throw new Error('A gateway cannot have more than 10 peripherals')
    }

    const doc = await gatewayModel.findOne({_id: gateway._id})

    doc.overwrite(gateway)
    const result = await doc.save()
    return result
  },

  async delete(id) {
    const result = await gatewayModel.findByIdAndDelete(id)
    return result
  }
}
