const Article = require('../models/article'),
  ROLE = require('../../config').ROLE;

function setCondition(session) {
  let condition = {};
  if (!session || session.access !== 'administrator') {
    condition.isPublic = true;
  }
  // console.log(condition);
  return condition;
}

// check article href
exports.checkArticleHref = (href) => {
  // console.log(href);
  return Article.findOne({ href });
}

// get article by id
exports.getArticleById = (_id, session) => {
  return Article.findArticle(Object.assign({}, { _id }, setCondition(session)));
};

// get article by href name
exports.getArticleByHref = (href, session) => {
  // console.log(Object.assign({}, { href }, setCondition(session)));
  return Article.findArticle(Object.assign({}, { href }, setCondition(session)));
};

// get articles
exports.getArticles = (offset, limit, cat, before, s, tag, sortBy, sortOrder, session) => {
  return Article.findArticles(+offset, +limit, cat, before, s, tag, sortBy, sortOrder, setCondition(session));
};

// delete article
exports.deleteArticle = (_id) => {
  return Article.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
};

// add article
exports.addArticle = (article) => {
  return new Article(article).save();
};

// update article
exports.updateArticle = (_article) => {
  return Article.findByIdAndUpdate(_article._id, _article, { new: true });
};