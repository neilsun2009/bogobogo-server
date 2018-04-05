const ROLE = require('../config').ROLE,
  ACTIONS = {
    // auth
    'LOGIN': {
      url: '/api/session',
      method: 'PUT',
      controller: 'login'
    },
    'SIGNUP': {
      url: '/api/session',
      method: 'POST',
      controller: 'signup'
    },
    'CHECK_AUTH': {
      url: '/api/session',
      method: 'GET',
      controller: 'checkAuth'
    },
    'LOGOUT': {
      url: '/api/session',
      method: 'DELETE',
      controller: 'logout',
      auth: ROLE.user
    },
    // article
    'GET_ARTICLE': {
      url: '/api/article',
      method: 'GET',
      controller: 'getArticle'
    },
    'GET_ARTICLES': {
      url: '/api/articles',
      method: 'GET',
      controller: 'getArticles'
    },
    'UPDATE_ARTICLE': {
      url: '/api/article',
      method: 'PUT',
      controller: 'updateArticle',
      auth: ROLE.administrator
    },
    'ADD_ARTICLE': {
      url: '/api/article',
      method: 'POST',
      controller: 'addArticle',
      auth: ROLE.administrator
    },
    'DELETE_ARTICLE': {
      url: '/api/article',
      method: 'DELETE',
      controller: 'deleteArticle',
      auth: ROLE.administrator
    },
    // word
    'GET_WORDS': {
      url: '/api/words',
      method: 'GET',
      controller: 'getWords'
    },
    'ADD_WORD': {
      url: '/api/word',
      method: 'POST',
      controller: 'addWord',
      auth: ROLE.administrator
    },
    'DELETE_WORD': {
      url: '/api/word',
      method: 'DELETE',
      controller: 'deleteWord',
      auth: ROLE.administrator
    },
    // general
    'GET_GENERAL': {
      url: '/api/general',
      method: 'GET',
      controller: 'getGeneral'
    },
    'UPDATE_GENERAL': {
      url: '/api/general',
      method: 'PUT',
      controller: 'updateGeneral',
      auth: ROLE.administrator
    },
    // qiniu
    'GET_QINIU_TOKEN': {
      url: '/api/qiniu_token',
      method: 'GET',
      controller: 'getQiniuToken'
    }
  };

module.exports = ACTIONS;