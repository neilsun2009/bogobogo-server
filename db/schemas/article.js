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
    title: String,
    cover: String,
    html: String,
    text: String,
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
  // console.log(article);
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
    // console.log(conditions);
    return this
      .findOne(Object.assign({}, conditions, { isDeleted: false}))
      .exec();
  },
  findArticles(offset, limit, cat, before, s, tag, sortBy, sortOrder, condition) {
    return new Promise((resolve, reject) => {
      let query = this
          .count(Object.assign( // 数量
            {}, 
            condition, 
            { isDeleted: false }
          )),
        count = -1;
      if (typeof s === 'string' && s.length) { // 关键字
        query.regex('title', new RegExp(s, 'gi'));
      }
      if (before && before.length) { // 时间
        query.lt('addTime', new Date(before));
      }
      if (tag && tag.length) {
        query.where('tags', tag);
      }
      if (cat && cat.length) {
        query.where('cat', cat);
      }
      query.exec()
        .then((countResult) => {
          count = countResult;
          query.find().select('-paras');
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