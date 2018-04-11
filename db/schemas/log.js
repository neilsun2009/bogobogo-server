const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;
let LogSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },
  addTime: {
    type: Date,
    default: Date.now(),
    select: false
  },
  updateTime: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, {collection: 'logs'});

LogSchema.pre('save', function(next) {
  let log = this;
  log.updateTime = Date.now();
  if (log.isNew) {
    log.addTime = Date.now();
  }
  next();
});

LogSchema.pre('findOneAndUpdate', function(next) {
  this.update({},{ 
    $set: { 
      'updateTime': Date.now()
    }
  });
  next();
});

LogSchema.statics = {
  findLog(conditions) {
    return this
      .findOne(Object.assign({}, conditions, { isDeleted: false}))
      .exec();
  },
  findLogs(offset, limit, condition) {
    return new Promise((resolve, reject) => {
      let query = this
          .count(Object.assign( // 数量
            {}, 
            condition, 
            { isDeleted: false }
          )),
        count = -1;
      query.exec()
        .then((countResult) => {
          count = countResult;
          query.find();
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
        .then((logs) => {
          resolve({ count, logs });
        }, (err) => {
          reject(err);
        });
    });
  }
};

module.exports = LogSchema;