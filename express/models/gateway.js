const mongoose = require('mongoose')

const gatewaySchema = new mongoose.Schema({
  serial: { type: String, required: true },
  name: { type: String, required: true },
  ip: { type: String },
  peripherals: [{type: mongoose.Schema.Types.ObjectId, ref: "peripheral"}]
})

module.exports = mongoose.model('gateway', gatewaySchema)
