const express = require('express'),
  path = require('path'),
  // cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  mongoose = require('mongoose'),
  mongoStore = require('connect-mongo')(session),
  // logger = require('morgan'),
  MONGO_CONFIG = require('./config/mongo_config'),
  PORT = require('./config').PORT,
  DB_URL = `mongodb://bogobogoAdmin:${MONGO_CONFIG.pwd}@localhost/bogobogo`,
  DB_OPTIONS = {
    autoReconnect: true,
    poolSize: 10,
    // useMongoClient: true
  },
  apiRouter = require('./routes'),
  init = require('./init'),
  app = express();

// error
process.on('uncaughtException', function(err) {
  console.error(err.stack);
});

// DB related
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, DB_OPTIONS);

// init
init();

// middlewares
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static'), {
  maxAge: 1000 * 60 * 60 * 24 * 30,
  lastModified: true
}));
app.use(session({
  secret: MONGO_CONFIG.secret,
  cookie: { 
    maxAge:  1000 * 60 * 60 * 24 * 15
  },
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'session'
  }),
  resave: false,
  saveUninitialized: true,
  rolling: true
}));
// // refresh session
// app.use((req, res, next) => {
//   req.session.touch();
//   next();
// });

// router
apiRouter(app);
// angular hash redirect
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

// listen
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});