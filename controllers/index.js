const AUTH_CONTROLLER = require('./auth'),
  GENERAL_CONTROLLER = require('./general'),
  ARTICLE_CONTROLLER = require('./article'),
  WORD_CONTROLLER = require('./word'),
  QINIU_CONTROLLER = require('./qiniu'),
  BYTE_CONTROLLER = require('./byte'),
  LOG_CONTROLLER = require('./log'),
  CONTROLLERS = Object.assign({}, 
    AUTH_CONTROLLER,
    GENERAL_CONTROLLER,
    ARTICLE_CONTROLLER,
    WORD_CONTROLLER,
    QINIU_CONTROLLER,
    BYTE_CONTROLLER,
    LOG_CONTROLLER
  );

module.exports = CONTROLLERS;