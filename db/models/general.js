let mongoose = require('mongoose'),
  BonusSchema = require('../schemas/bonus'),
  model = mongoose.model('Bonus', BonusSchema);

module.exports = model;