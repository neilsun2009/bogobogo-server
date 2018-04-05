const AUTH_CONTROLLER = require('./auth'),
  USER_CONTROLLER = require('./user'),
  PROJECT_CONTROLLER = require('./project'),
  BONUS_CONTROLLER = require('./bonus'),
  SCORE_CONTROLLER = require('./score'),
  EXCEL_CONTROLLER = require('./excel'),
  DEPT_CONTROLLER = require('./dept'),
  MAIL_CONTROLLER = require('./mail'),
  CONTROLLERS = Object.assign({}, 
    AUTH_CONTROLLER,
    USER_CONTROLLER,
    PROJECT_CONTROLLER,
    BONUS_CONTROLLER,
    SCORE_CONTROLLER,
    EXCEL_CONTROLLER,
    DEPT_CONTROLLER,
    MAIL_CONTROLLER
  );

module.exports = CONTROLLERS;