const generalController = require('../db/controllers/general'),
  config = require('../config'),
  dataHandler = require('../utils/dataHandler'),
  ROLE = config.ROLE;
let controller = {};

controller.getGeneral = (req, res, params) => {
  generalController.getGeneral()
    .then((data) => {
      if (data) {
        res.json({ code: 200, message: 'Get general succeeded.', data: data, result: true });
      } else {
        res.json({ code: 400, message: 'No general found.', data: null, result: false });        
      }
    }, (err) => {
      res.json({ code: 500, message: 'Server error.', data: err, result: false });
    });
};

controller.updateGeneral = (req, res, params) => {
  const { cat } = params;
  delete params.cat;
  generalController.getGeneral()
    .then((data) => {
      if (data) {
        data.cats[cat] = params;
        // console.log(data);
        return generalController.updateGeneral(data);
        // res.json({ code: 200, message: 'Get general succeeded.', data: data, result: true });
      } else {
        res.json({ code: 400, message: 'No general found.', data: null, result: false });        
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
    .then((general) => {
      res.json({ code: 200, message: 'General update succeeded.', data: general, result: true });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err, {
        code: 500,
        message: 'Server error.',
        data: err,
        result: false
      }));
    })
    .catch((e) => {
      delete e.handled;
      res.json(e);
    });
};


module.exports = controller;