let mongoose = require('mongoose'),
  ByteSchema = require('../schemas/byte'),
  model = mongoose.model('Byte', ByteSchema);

module.exports = model;