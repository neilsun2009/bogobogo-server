const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;
let ArticleSchema = new mongoose.Schema({
  href: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: [String],
  description: String,
  cat: {
    type: String,
    required: true,
  },
  primaryColor: {
    type: String,
    required: true,
  },
  secondaryColor: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  paras: [{
    title: string,
    cover: string,
    html: string,
    text: string,
  }],
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
    default: Date.now()
  }
}, {collection: 'articles'});

ArticleSchema.pre('save', function(next) {
  let article = this;
  article.updateTime = Date.now();
  if (article.isNew) {
    article.addTime = Date.now();
  }
  next();
});

ArticleSchema.pre('findOneAndUpdate', function(next) {
  this.update({},{ 
    $set: { 
      'updateTime': Date.now()
    }
  });
  next();
});

ArticleSchema.statics = {
  findArticle(conditions) {
    return this
      .findOne(Object.assign({}, conditions, { isDeleted: false}))
      .exec();
  },
  findArticles(offset, limit, sortBy, sortOrder, conditions, s) {
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
        .then((articles) => {
          resolve({ count, articles });
        }, (err) => {
          reject(err);
        });
    });
  }
};

module.exports = ArticleSchema;