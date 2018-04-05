let mongoose = require('mongoose'),
  ScoreSchema = require('../schemas/score'),
  model = mongoose.model('Score', ScoreSchema);

module.exports = model;