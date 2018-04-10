const General = require('../models/general'),
  ROLE = require('../../config').ROLE;

function setCondition(session) {
  let condition = {};
  if (session && session.access !== 'administrator') {
    condition.isPublic = false;
  }
  return condition;
}

// get general
exports.getGeneral = (_id) => {
  return General.findOne();
};

// add general
exports.addGeneral = (general) => {
  return new General(general).save();
};

// update general
exports.updateGeneral = (_general) => {
  return General.findOneAndUpdate({}, _general, { new: true });
};