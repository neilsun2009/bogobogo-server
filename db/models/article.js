let mongoose = require('mongoose'),
  ProjectSchema = require('../schemas/project'),
  model = mongoose.model('Project', ProjectSchema);

module.exports = model;