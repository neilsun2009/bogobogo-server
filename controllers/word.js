const wordController = require('../db/controllers/word'),
  config = require('../config'),
  dataHandler = require('../utils/dataHandler'),
  ROLE = config.ROLE;
let controller = {};

controller.getWords = (req, res, params) => {
  const session = req.session.user,
    {offset, limit, before, s, sortBy, sortOrder,} = params;
  wordController.getWords(offset, limit, before, s, sortBy, sortOrder, session)
    .then((data) => {
      res.json({ code: 200, message: 'Get words succeeded.', data: data, result: true });
    }, (err) => {
      res.json({ code: 500, message: 'Server error.', data: err, result: false });
    });
};

controller.deleteWord = (req, res, params) => {
  const _id = params.wordId;
  wordController.deleteWord(_id)
    .then(() => {
      res.json({ code: 200, message: 'Delete word succeeded.', data: null, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Word ID invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
};

controller.addWord = (req, res, params) => {
  let _word = { };
  Object.assign(_word, params);
  wordController.addWord(_word)
    .then((data) => {
      res.json({ code: 200, message: 'Word post succeeded.', data, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Data invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
};

controller.updateWord = (req, res, params) => {
  let _word = { _id: params.wordId };
  delete params._id;
  Object.assign(_word, params);  
  wordController.updateWord(_word)
    .then((data) => {
      res.json({ code: 200, message: 'Word update succeeded.', data, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Data invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
}

module.exports = controller;