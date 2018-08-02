// a batch code to update image address in the db
// change all the 'http://olxpdoc6c.bkt.clouddn.com'
// to 'https://static.bogobogo.cn'

const mongoose = require('mongoose'),
  MONGO_CONFIG = require('../config/mongo_config'),
  DB_URL = `mongodb://bogobogoAdmin:${MONGO_CONFIG.pwd}@localhost/bogobogo`,
  DB_OPTIONS = {
    autoReconnect: true,
    poolSize: 10,
    // useMongoClient: true
  },
  Article = require('../db/models/article'),
  Word = require('../db/models/word'),
  ALTER = {
    src: 'http://olxpdoc6c.bkt.clouddn.com',
    tar: 'https://static.bogobogo.cn'
  };
let db;

function modify(str) {
  if (typeof str === 'string') {
    str = str.replace(new RegExp(ALTER.src, 'g'), ALTER.tar);
  }
  return str;
}

// DB related
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, DB_OPTIONS);
db = mongoose.connection;
db.once('open', () => {
  console.log('DB connected');
  // Word.find({}, (err, words) => {
  //   let num = words.length;
  //   console.log(`Found ${num} documents.`);
  //   for (let i = 0; i < num; ++i) {
  //     let word = words[i],
  //       image = modify(word.image);
  //     word.update({$set: {image}}, () => {
  //       console.log(`Updated No. ${i}`);
  //     });    
  //   }
  // });
  Article.find({}, (err, articles) => {
    let num = articles.length;
    console.log(`Found ${num} documents.`);
    for (let i = 0; i < num; ++i) {
      let article = articles[i],
        paras = article.paras;
      article.image = modify(article.image);
      for (let j = 0, len = paras.length; j < len; ++j) {
        paras[j].cover = modify(paras[j].cover);
        paras[j].html = modify(paras[j].html);
      }
      article.save(() => {
        console.log(`Updated No. ${i}`);
      });    
    }
  });
});