const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;
let WordSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },
  addTime: {
    type: Date,
    default: Date.now()
  },
  updateTime: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, {collection: 'words'});

WordSchema.pre('save', function(next) {
  let word = this;
  word.updateTime = Date.now();
  if (word.isNew) {
    word.addTime = Date.now();
  }
  next();
});

WordSchema.pre('findOneAndUpdate', function(next) {
  this.update({},{ 
    $set: { 
      'updateTime': Date.now()
    }
  });
  next();
});

WordSchema.statics = {
  findWord(conditions) {
    return this
      .findOne(Object.assign({}, conditions, { isDeleted: false}))
      .exec();
  },
  findWords(offset, limit, sortBy, sortOrder, conditions, s) {
    return new Promise((resolve, reject) => {
      let query = this
          .count(Object.assign( // 数量
            {}, 
            conditions, 
            { isDeleted: false }
          )),
        count = -1;
      if (s.length && typeof s === 'string') { // 关键字
        query.regex('title', new RegExp(s, 'gi'));
      }
      query.exec()
        .then((countResult) => {
          count = countResult;
          query.find();
          sortBy = sortBy || 'addTime'; // 排序
          sortBy = sortOrder === 'asc' ? sortBy : `-${sortBy}`;
          query.sort(sortBy);
          if (offset > 0) {
            query.skip(offset);
          }
          if (limit > 0) {
            query.limit(limit);
          }
          return query.exec();
        }, (err) => {
          reject(err);
        })
        .then((words) => {
          resolve({ count, words });
        }, (err) => {
          reject(err);
        });
    });
  }
};

module.exports = WordSchema;