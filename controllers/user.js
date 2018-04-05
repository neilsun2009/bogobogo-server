const userController = require('../db/controllers/user'),
  config = require('../config'),
  dataHandler = require('../utils/dataHandler'),
  ROLE_ENUM = config.ROLE_ENUM,
  SUPER_ADMIN = config.SUPER_ADMIN;
let controller = {};

function checkRoleEnum(role) {
  for (const _role in ROLE_ENUM) {
    if (role === ROLE_ENUM[_role]) {
      return true;
    }
  }
  return false;
}

controller.getUsers = (req, res, params) => {
  let pageParams = dataHandler.parsePageParams(params);
  userController.getUsers(pageParams.pageNum, pageParams.pageSize)
    .then((data) => {
      res.json({
        code: 200,
        message: '获取用户成功',
        data
      });
    }, (err) => {
      res.json({
        code: 500,
        message: '服务器错误',
        data: err      
      });
    });
};

controller.getUsersByRole = (req, res, params) => {
  let pageParams = dataHandler.parsePageParams(params),
    role = parseInt(params.roleEnum);
  if (!checkRoleEnum(role)) {
    res.json({
      code: 400,
      message: '该权限值不存在',
      data: null     
    });
    return;
  }
  userController.getUsersByRole(pageParams.pageNum, pageParams.pageSize, role)
    .then((data) => {
      res.json({
        code: 200,
        message: '获取用户成功',
        data
      });
    }, (err) => {
      res.json({
        code: 500,
        message: '服务器错误',
        data: err      
      });
    });
};

controller.getUsersByName = (req, res, params) => {
  let pageParams = dataHandler.parsePageParams(params),
    name = params.username && params.username.toString();
  userController.getUsersByName(pageParams.pageNum, pageParams.pageSize, name)
    .then((data) => {
      res.json({
        code: 200,
        message: '获取用户成功',
        data
      });
    }, (err) => {
      res.json({
        code: 500,
        message: '服务器错误',
        data: err      
      });
    });
};

controller.getUsersByFullDeptName = (req, res, params) => {
  let pageParams = dataHandler.parsePageParams(params),
    name = params.fullDeptName && params.fullDeptName.toString();
  userController.getUsersRecursivelyByFullDeptName(pageParams.pageNum, pageParams.pageSize, name)
    .then((data) => {
      res.json({
        code: 200,
        message: '获取用户成功',
        data
      });
    }, (err) => {
      res.json({
        code: 500,
        message: '服务器错误',
        data: err      
      });
    });
};

controller.getUserById = (req, res, params) => {
  let _id = params.userId && params.userId.toString();
  userController.getUserById(_id)
    .then((user) => {
      if (user) {
        res.json({
          code: 200,
          message: '获取用户成功',
          data: user
        });
      } else {
        res.json({
          code: 400,
          message: '该id用户不存在',
          data: null
        });
      }
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({
          code: 400,
          message: '该id用户不存在',
          data: null
        });
      } else {
        res.json({
          code: 500,
          message: '服务器错误',
          data: err
        });
      }
    });
};

controller.updateUserRole = (req, res, params) => {
  let _id = params.userId && params.userId.toString(),
    role = parseInt(params.role);
  if (!checkRoleEnum(role)) {
    res.json({
      code: 400,
      message: '该权限值不存在',
      data: null     
    });
    return;
  }
  // if (role === ROLE_ENUM.SUPER_ADMIN) {
  //   res.json({
  //     code: 403,
  //     message: '不可提升权限至超级管理员',
  //     data: null     
  //   });
  //   return;
  // }
  userController.updateUser({ _id, role })
    .then((user) => {
      if (user) {
        res.json({
          code: 200,
          message: '修改成功',
          data: user
        });
      } else {
        res.json({
          code: 400,
          message: '该id用户不存在',
          data: null
        });
      }
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({
          code: 400,
          message: '该id用户不存在',
          data: null
        });
      } else {
        res.json({
          code: 500,
          message: '服务器错误',
          data: err      
        });
      }
    });
};

controller.updateAdminPassword = (req, res, params) => {
  let { oldPwd, newPwd } = params;
  oldPwd = oldPwd ? oldPwd.toString() : '';
  newPwd = newPwd ? newPwd.toString() : '';
  userController.checkUsernameAndPassword(SUPER_ADMIN.username, oldPwd)
    .then((user) => {
      if (user) {
        userController.updateUser({
          _id: user._id, 
          password: newPwd
        }).then(() => {
          res.json({
            code: 200,
            message: '修改成功',
            data: null
          });
        }, (err) => {
          res.json({
            code: 500,
            message: '服务器错误',
            data: err      
          });
        });
      } else {
        res.json({
          code: 403,
          message: '原始密码错误',
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
};

module.exports = controller;