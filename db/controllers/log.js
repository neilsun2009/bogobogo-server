const Log = require('../models/log'),
  ROLE = require('../../config').ROLE;

// get log by id
exports.getLogById = (_id) => {
  return Log.findLog(Object.assign({}, { _id }));
};

// get logs
exports.getLogs = (offset, limit) => {
  return Log.findLogs(+offset, +limit, {});
};

// delete log
exports.deleteLog = (_id) => {
  return Log.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
};

// add log
exports.addLog = (log) => {
  return new Log(log).save();
};

// update log
exports.updateLog = (_log) => {
  return Log.findByIdAndUpdate(_log._id, _log, { new: true });
};