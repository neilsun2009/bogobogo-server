const logController = require('../db/controllers/log'),
  config = require('../config'),
  dataHandler = require('../utils/dataHandler'),
  ROLE = config.ROLE;
let controller = {};

controller.getLogs = (req, res, params) => {
  const session = req.session.user,
    {offset, limit} = params;
  logController.getLogs(offset, limit)
    .then((data) => {
      res.json({ code: 200, message: 'Get logs succeeded.', data: data, result: true });
    }, (err) => {
      res.json({ code: 500, message: 'Server error.', data: err, result: false });
    });
};

controller.deleteLog = (req, res, params) => {
  const _id = params.logId;
  logController.deleteLog(_id)
    .then(() => {
      res.json({ code: 200, message: 'Delete log succeeded.', data: null, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Log ID invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
};

controller.addLog = (req, res, params) => {
  let _log = { };
  Object.assign(_log, params);
  logController.addLog(_log)
    .then((data) => {
      res.json({ code: 200, message: 'Log post succeeded.', data, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Data invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
};

// controller.updateLog = (req, res, params) => {
//   let _log = { _id: params.logId };
//   delete params._id;
//   Object.assign(_log, params);  
//   logController.updateLog(_log)
//     .then((data) => {
//       res.json({ code: 200, message: 'Log update succeeded.', data, result: true });
//     }, (err) => {
//       if (err.name === 'CastError') {
//         res.json({ code: 400, message: 'Data invalid.', data: err, result: false });
//       } else {
//         res.json({ code: 500, message: 'Server error.', data: err, result: false });
//       }
//     });
// }

module.exports = controller;