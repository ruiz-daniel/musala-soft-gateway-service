const mongoose = require('mongoose')

const peripheralSchema = new mongoose.Schema({
  date: { type: String, default: new Date().toString() },
  vendor: { type: String },
  status: { type: Boolean, default: true },
})

module.exports = mongoose.model('peripheral', peripheralSchema)
