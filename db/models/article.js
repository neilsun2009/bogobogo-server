let mongoose = require('mongoose'),
  ArticleSchema = require('../schemas/article'),
  model = mongoose.model('Article', ArticleSchema);

module.exports = model;