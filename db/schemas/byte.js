const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;
let ByteSchema = new mongoose.Schema({
  date: { // here before is a string with the format of 'yyyy-MM-dd'
    type: String,
    required: true
  },
  character: {
    type: String,
    required: true
  },
  note: String,
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },
  addTime: {
    type: Date,
    default: Date.now(),
    select:false
  },
  updateTime: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, {collection: 'bytes'});

ByteSchema.pre('save', function(next) {
  let byte = this;
  byte.updateTime = Date.now();
  if (byte.isNew) {
    byte.addTime = Date.now();
  }
  next();
});

ByteSchema.pre('findOneAndUpdate', function(next) {
  this.update({},{ 
    $set: { 
      'updateTime': Date.now()
    }
  });
  next();
});

ByteSchema.statics = {
  findByte(conditions) {
    return this
      .findOne(Object.assign({}, conditions, { isDeleted: false}))
      .exec();
  },
  findBytes(offset, limit, after, conditions) { // here after is a string with the format of 'yyyy-MM-dd'
    return new Promise((resolve, reject) => {
      let query = this
          .count(Object.assign( // 数量
            {}, 
            conditions,
            { isDeleted: false }
          )),
        count = -1;
      if (after && after.length) { // 时间
        query.gte('date', after);
      }
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
        .then((bytes) => {
          resolve({ count, bytes });
        }, (err) => {
          reject(err);
        });
    });
  }
};

module.exports = ByteSchema;