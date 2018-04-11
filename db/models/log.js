let mongoose = require('mongoose'),
  LogSchema = require('../schemas/log'),
  model = mongoose.model('Log', LogSchema);

module.exports = model;