const cvteUtil = require('../utils/cvte'),
  userController = require('../db/controllers/user'),
  deptController = require('../db/controllers/dept'),
  SUPER_ADMIN = require('../config').SUPER_ADMIN.username,
  dataHandler = require('../utils/dataHandler');
let controller = {};

controller.login = (req, res, params) => {
  let { username, password } = params,
    _user = null;
  // 验证是否已登录
  if (req.session.user) {
    res.json({
      code: 403,
      message: '已登录',
      data: req.session.user
    });
    return;
  }
  username = username.toString();
  password = password.toString();
  
  // 验证权限
  if (username === SUPER_ADMIN) { // 超级管理员
    userController.checkUsernameAndPassword(username, password)
      .then((user) => {
        if (user) {
          // 成功保存信息
          req.session.regenerate(() => {
            req.session.user = user;
            res.json({
              code: 200,
              message: '登录成功',
              data: user
            });
          });
        } else {
          res.json({
            code: 403,
            message: '用户名或密码错误',
            data: null
          });
        }
      }, (err) => {
        res.json({
          code: 500,
          message: '服务器错误',
          data: err
        });
      });
  } else { // 管理员与普通用户
    // 确定用户名密码
    cvteUtil.cvteLoginAuth(params.username, params.password)
      .then(() => {
        // 拉取用户信息
        return cvteUtil.cvteUserDetail(params.username);
      }, (err) => {
        if (err.status === 403 || err.status === 400) {
          return Promise.reject({
            code: 403,
            message: '用户名或密码错误',
            data: null,
            handled: true
          });
        } else {
          return Promise.reject({
            code: 400,
            message: '域系统错误',
            data: null,
            handled: true
          });
        }
      })
      .then((resp) => {
        // console.log(resp.body.data);
        const { username, chName, email, gender, fullDeptName, deptName, positionName } = resp.body.data;
        _user = { username, chName, email, gender, fullDeptName, deptName, positionName };
        // 检查并创建部门信息
        deptController.checkDept(fullDeptName)
          .then(() => {

          }, (err) => {
            console.log(`Error saving departments: ${err}`);
          });
        // 检查用户名
        return userController.checkUsername(_user.username);
      }, (err) => {
        return Promise.reject(dataHandler.errorHandler(err, {
          code: 400,
          message: '域系统错误',
          data: null,
          handled: true
        }));
      })
      .then((user) => { 
        if (user) { // 更新用户信息
          return userController.updateUser(Object.assign({}, {_id: user._id}, _user));
        } else { // 保存新用户
          return userController.addUser(_user);
        }
      }, (err) => {
        return Promise.reject(dataHandler.errorHandler(err, {
          code: 500,
          message: '服务器错误',
          data: err,
          handled: true
        }));
      })
      .then((user) => {
        // 成功保存信息
        req.session.regenerate(() => {
          req.session.user = user;
          res.json({
            code: 200,
            message: '登录成功',
            data: user
          });
        });
      }, (err) => {
        return Promise.reject(dataHandler.errorHandler(err, {
          code: 500,
          message: '服务器错误',
          data: err,
          handled: true
        }));
      })
      .catch((e) => {
        delete e.handled;
        res.json(e);
      });
  }
};

controller.checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({
      code: 200,
      message: '已登录',
      data: req.session.user
    });
  } else {
    res.json({
      code: 403,
      message: '未登录',
      data: null
    });
  }
};

controller.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({
      code: 200,
      message: '注销成功',
      data: null
    });
  });
};

module.exports = controller;
