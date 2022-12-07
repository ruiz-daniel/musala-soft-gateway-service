const mongoose = require('mongoose')

const gatewaySchema = new mongoose.Schema({
  serial: { type: String, required: true },
  name: { type: String, required: true },
  ip: { type: String },
})

module.exports = mongoose.model('gateway', gatewaySchema)
