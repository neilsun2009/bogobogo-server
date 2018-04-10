const Word = require('../models/word'),
  ROLE = require('../../config').ROLE;

function setCondition(session) {
  let condition = {};
  if (!session || session.access !== 'administrator') {
    condition.isPublic = true;
  }
  return condition;
}

// get word by id
exports.getWordById = (_id, session) => {
  return Word.findWord(Object.assign({}, { _id }, setCondition(session)));
};

// get words
exports.getWords = (offset, limit, before, s, sortBy, sortOrder, session) => {
  return Word.findWords(+offset, +limit, before, s, sortBy, sortOrder, setCondition(session));
};

// delete word
exports.deleteWord = (_id) => {
  return Word.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
};

// add word
exports.addWord = (word) => {
  return new Word(word).save();
};

// update word
exports.updateWord = (_word) => {
  return Word.findByIdAndUpdate(_word._id, _word, { new: true });
};