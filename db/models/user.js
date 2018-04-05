let mongoose = require('mongoose'),
  UserSchema = require('../schemas/user'),
  model = mongoose.model('User', UserSchema);

module.exports = model;