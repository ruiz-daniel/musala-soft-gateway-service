const mongoose = require('mongoose')

const peripheralSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: String },
  vendor: { type: String },
  status: { type: Boolean },
})

module.exports = mongoose.model('peripheral', peripheralSchema)
