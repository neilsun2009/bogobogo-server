const articleController = require('../db/controllers/article'),
  config = require('../config'),
  dataHandler = require('../utils/dataHandler'),
  pinyin = require('tiny-pinyin'),
  ROLE = config.ROL;
let controller = {};

controller.getArticleByHref = (req, res, params) => {
  const session = req.session.user;
  articleController.getArticleByHref(params.href, session)
  .then((article) => {
    if (article) {
      article.views += 1;
      // add view number
      return articleController.updateArticle({_id: article._id, views: article.views});
    } else {
      let returnErr = {
        code: 400,
        message: 'No article found.',
        data: null,
        result: false,
        handled: true
      }
      return Promise.reject(returnErr);
      // res.json({ code: 400,  message: 'No article found.', data: null, result: false });
    }
  }, (err) => {
    let returnErr = {
      code: 500,
      message: 'Server error.',
      data: err,
      result: false,
      handled: true
    }
    return Promise.reject(returnErr);
    // res.json({ code: 500, message: 'Server error.', data: err, result: false });
  })
  .then((article) => {
    res.json({ code: 200, message: 'Get article succeeded.',  data: article, result: true });
  }, (err) => {
    return Promise.reject(dataHandler.errorHandler(err, {
      code: 500,
      message: 'Server error.',
      data: err,
      result: false
    }));
  })
  .catch((e) => {
    delete e.handled;
    res.json(e);
  });
};

controller.getArticles = (req, res, params) => {
  const session = req.session.user,
    {offset, limit, cat, before, s, tag, sortBy, sortOrder} = params;
  articleController.getArticles(offset, limit, cat, before, s, tag, sortBy, sortOrder, session)
    .then((data) => {
      res.json({ code: 200, message: 'Get articles succeeded.', data: data, result: true });
    }, (err) => {
      // console.log(err);
      res.json({ code: 500, message: 'Server error.', data: err, result: false });
    });
};

controller.deleteArticle = (req, res, params) => {
  const _id = params.articleId;
  articleController.deleteArticle(_id)
    .then(() => {
      res.json({ code: 200, message: 'Delete article succeeded.', data: null, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Article ID invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
};

controller.addArticle = (req, res, params) => {
  const { title } = params,
    session = req.session.user;
  let _article = { },
    pinyinTitle = pinyin.convertToPinyin(title.toString(), '', true),
    href = pinyinTitle.toLowerCase().split(/\s+/g).join('-').replace(/[^a-z0-9\-]+/g, '');
  delete params._id;
  Object.assign(_article, params, { href });
  // console.log(_article);
  // check if this href is available
  articleController.checkArticleHref(_article.href)
    .then((article) => {
      // console.log(article);
      if (article) {
        _article.href += `-${Date.now()}${Math.floor(Math.random()*100)}`;
      }
      return articleController.addArticle(_article)
    })
    .then((data) => {
      res.json({ code: 200, message: 'Article post succeeded.', data, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Data invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
};

controller.updateArticle = (req, res, params) => {
  let _article = { _id: params.articleId };
  delete params._id;
  Object.assign(_article, params);
  // console.log(_article);
  articleController.updateArticle(_article)
    .then((article) => {
      res.json({ code: 200, message: 'Article update succeeded.', data: article, result: true });
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: 'Article ID invalid.', data: err, result: false });
      } else {
        res.json({ code: 500, message: 'Server error.', data: err, result: false });
      }
    });
};

module.exports = controller;