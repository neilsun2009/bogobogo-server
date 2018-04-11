const byteController = require('../db/controllers/byte'),
  config = require('../config'),
  dataHandler = require('../utils/dataHandler'),
  ROLE = config.ROLE;
let controller = {};

controller.getBytes = (req, res, params) => {
  const session = req.session.user,
    { offset, limit, after } = params;
  byteController.getBytes(offset, limit, after)
    .then((data) => {
      res.json({ code: 200, message: 'Get bytes succeeded.', data: data, result: true });
    }, (err) => {
      res.json({ code: 500, message: 'Server error.', data: err, result: false });
    });
};

controller.deleteByte = (req, res, params) => {
  const _id = params.byteId;
  byteController.deleteByte(_id)
    .then(() => {
      res.json({ code: 200, message: 'Delete byte succeeded.', data: null, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Byte ID invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
};

controller.addByte = (req, res, params) => {
  let _byte = { };
  Object.assign(_byte, params);
  byteController.getByteByDate(_byte.date)
    .then((data) => {
      if (data) {
        let returnErr = {
          code: 400,
          message: 'Byte date duplicated.',
          data: null,
          result: false,
          handled: true
        }
        return Promise.reject(returnErr);
      } else {
        return byteController.addByte(_byte);
      }
    }, (err) => {
      let returnErr = {
        code: 500,
        message: 'Server error.',
        data: err,
        result: false,
        handled: true
      }
      return Promise.reject(returnErr);
    })
    .then((data) => {
      res.json({ code: 200, message: 'Byte post succeeded.', data, result: true });
    }, (err) => {
      let returnErr = {};
      if (err.name === 'CastError') {
        returnErr = {
          code: 400, 
          message: 'Data invalid.', 
          data: err, 
          result: false
        };
      } else {
        returnErr = {        
          code: 500, 
          message: 'Server error.', 
          data: err, 
          result: false 
        };
      }
      return Promise.reject(dataHandler.errorHandler(err, returnErr));
    })
    .catch((e) => {
      delete e.handled;
      res.json(e);
    });
};

controller.updateByte = (req, res, params) => {
  let _byte = { _id: params.byteId };
  delete params._id;
  Object.assign(_byte, params);  
  byteController.updateByte(_byte)
    .then((data) => {
      res.json({ code: 200, message: 'Byte update succeeded.', data, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Data invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
}

module.exports = controller;