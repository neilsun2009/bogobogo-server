let mongoose = require('mongoose'),
  WordSchema = require('../schemas/word'),
  model = mongoose.model('Word', WordSchema);

module.exports = model;