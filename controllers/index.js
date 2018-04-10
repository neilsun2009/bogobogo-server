const AUTH_CONTROLLER = require('./auth'),
  GENERAL_CONTROLLER = require('./general'),
  ARTICLE_CONTROLLER = require('./article'),
  WORD_CONTROLLER = require('./word'),
  QINIU_CONTROLLER = require('./qiniu'),
  CONTROLLERS = Object.assign({}, 
    AUTH_CONTROLLER,
    GENERAL_CONTROLLER,
    ARTICLE_CONTROLLER,
    WORD_CONTROLLER,
    QINIU_CONTROLLER
  );

module.exports = CONTROLLERS;