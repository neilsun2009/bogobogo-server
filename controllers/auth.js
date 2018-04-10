const userController = require('../db/controllers/user');
let controller = {};

controller.login = (req, res, params) => {
  let { username, password } = params,
    _user = null;
  // 验证是否已登录
  if (req.session.user) {
    res.json({
      code: 403,
      message: 'Already logged in.',
      data: req.session.user,
      result: false
    });
    return;
  }
  username = username.toString();
  password = password.toString();
    
  userController.checkUsernameAndPassword(username, password)
    .then((user) => {
      if (user) {
        // 成功保存信息
        req.session.regenerate(() => {
          req.session.user = user;
          res.json({
            code: 200,
            message: 'Logged in succeeded.',
            data: user,
            result: true
          });
        });
      } else {
        res.json({
          code: 403,
          message: 'Username or password invalid.',
          data: null,
          result: false
        });
      }
    }, (err) => {
      res.json({
        code: 500,
        message: 'Server error.',
        data: err,
        result: false
      });
    });
};

controller.signup = (req, res, params) => {
  let { username, password } = params;
  // 验证是否已登录
  if (req.session.user) {
    res.json({
      code: 403,
      message: 'Already logged in.',
      data: req.session.user,
      result: false
    });
    return;
  }
  username = username.toString();
  password = password.toString();
  userController.addUser({username, password, access: 'administrator'})
    .then((user) => {
      if (user) {
        // 成功保存信息
        res.json({
          code: 200,
          message: 'Signed up succeeded.',
          data: user,
          result: true
        });
      } else {
        res.json({
          code: 403,
          message: 'Username invalid.',
          data: null,
          result: false
        });
      }
    }, (err) => {
      res.json({
        code: 500,
        message: 'Server error.',
        data: err,
        result: false
      });
    });
}

controller.checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({
      code: 200,
      message: 'Logged in.',
      data: req.session.user,
      result: true
    });
  } else {
    res.json({
      code: 403,
      message: 'Not logged in.',
      data: null,
      result: false
    });
  }
};

controller.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({
      code: 200,
      message: 'Log out succeeded.',
      data: null,
      result: true
    });
  });
};

module.exports = controller;
