const mongoose = require('mongoose'),
  ROLE_ENUM = require('../../config').ROLE_ENUM;
let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  password: {
    type: String,
    default: '',
    select: false
  },
  access: {
    type: String,
    default: 'user',
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
}, {collection: 'users'});

UserSchema.pre('save', function(next) {
  let user = this;
  user.updateTime = Date.now();
  if (user.isNew) {
    user.addTime = Date.now(); 
  }
  next();
});

UserSchema.pre('findOneAndUpdate', function(next) {
  this.update({},{ 
    $set: { 
      'updateTime': Date.now()
    }
  });
  next();
});

UserSchema.statics = {
  findUser(conditions) {
    return this
      .findOne(Object.assign({}, conditions, { isDeleted: false}))
      .exec();
  },
  findUsers(offset, limit, conditions, name) {
    return new Promise((resolve, reject) => {
      let query = this
          .count(Object.assign(
            {}, 
            conditions, 
            { isDeleted: false }
          )),
        count = -1;
      if (name.length && typeof name === 'string') {
        query.regex('username', new RegExp(name, 'gi'));
      }
      query.exec()
        .then((countResult) => {
          count = countResult;
          query.find()
            .sort('username');
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
        .then((users) => {
          resolve({ count, users });
        }, (err) => {
          reject(err);
        });
    });
  }
};

module.exports = UserSchema;