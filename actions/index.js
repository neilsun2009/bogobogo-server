const ROLE = require('../config').ROLE,
  ACTIONS = {
    // auth
    'LOGIN': {
      url: '/api/session',
      method: 'POST',
      controller: 'login'
    },
    // 'SIGNUP': {
    //   url: '/api/user',
    //   method: 'POST',
    //   controller: 'signup'
    // },
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
    'GET_ARTICLE_BY_HREF': {
      url: '/api/article/href/:href',
      method: 'GET',
      controller: 'getArticleByHref'
    },
    'GET_ARTICLES': {
      url: '/api/articles',
      method: 'GET',
      controller: 'getArticles'
    },
    'UPDATE_ARTICLE_BY_ID': {
      url: '/api/article/id/:articleId',
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
    'DELETE_ARTICLE_BY_ID': {
      url: '/api/article/id/:articleId',
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
    'DELETE_WORD_BY_ID': {
      url: '/api/word/id/:wordId',
      method: 'DELETE',
      controller: 'deleteWord',
      auth: ROLE.administrator
    },
    'UPDATE_WORD_BY_ID': {
      url: '/api/word/id/:wordId',
      method: 'PUT',
      controller: 'updateWord',
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
    },
    // wx
    'GET_WX_TOKEN': {
      url: '/api/wx_token',
      method: 'GET',
      controller: 'getWXToken' 
    },
    // byte
    'GET_BYTES': {
      url: '/api/bytes',
      method: 'GET',
      controller: 'getBytes'
    },
    'ADD_BYTE': {
      url: '/api/byte',
      method: 'POST',
      controller: 'addByte',
      auth: ROLE.administrator
    },
    'DELETE_BYTE_BY_ID': {
      url: '/api/byte/id/:byteId',
      method: 'DELETE',
      controller: 'deleteByte',
      auth: ROLE.administrator
    },
    'UPDATE_BYTE_BY_ID': {
      url: '/api/byte/id/:byteId',
      method: 'PUT',
      controller: 'updateByte',
      auth: ROLE.administrator
    },
    // log
    'GET_LOGS': {
      url: '/api/logs',
      method: 'GET',
      controller: 'getLogs'
    },
    'ADD_LOG': {
      url: '/api/log',
      method: 'POST',
      controller: 'addLog',
      auth: ROLE.administrator
    },
    'DELETE_LOG_BY_ID': {
      url: '/api/log/id/:logId',
      method: 'DELETE',
      controller: 'deleteLog',
      auth: ROLE.administrator
    }
  };

module.exports = ACTIONS;