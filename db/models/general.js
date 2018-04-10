let mongoose = require('mongoose'),
  GeneralSchema = require('../schemas/general'),
  model = mongoose.model('General', GeneralSchema);

module.exports = model;