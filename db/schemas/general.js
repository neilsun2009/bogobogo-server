const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;
let GeneralSchema = new mongoose.Schema({
  cats: {
    index: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
    bio: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
    design: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
    coding: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
    translation: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
    bytes: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
    words: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
    blog: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
    more: {
      primaryColor: String,
      secondaryColor: String,
      layerBg: String,
      title: String
    },
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
}, {collection: 'generals'});

GeneralSchema.pre('save', function(next) {
  let general = this;
  general.updateTime = Date.now();
  if (general.isNew) {
    general.addTime = Date.now();
  }
  next();
});

GeneralSchema.pre('findOneAndUpdate', function(next) {
  this.update({},{ 
    $set: { 
      'updateTime': Date.now()
    }
  });
  next();
});

GeneralSchema.statics = {
  findGeneral(conditions) {
    return this
      .findOne(Object.assign({}, conditions, { isDeleted: false}))
      .exec();
  }
};

module.exports = GeneralSchema;