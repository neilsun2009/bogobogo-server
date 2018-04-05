const User = require('../models/user'),
  crypt = require('../../utils/crypt'),
  ROLE_ENUM = require('../../config').ROLE_ENUM;

// 检查用户名是否存在
exports.checkUsername = (username) => {
  return User.findUser({username});
};

// 检查用户名与密码
exports.checkUsernameAndPassword = (username, password) => {
  return User.findUser({username, password: crypt.md5(password)});
};

// 加入新用户
exports.addUser = (user) => {
  let _user = new User(user);
  return _user.save();
};

// 加入超级管理员
exports.addSuperAdmin = (username, password) => {
  let user = new User({
    username,
    password: crypt.md5(password),
    role: ROLE_ENUM.SUPER_ADMIN,
    chName: '超级管理员'
  });
  return user.save();
};

// 更新用户信息
exports.updateUser = (user) => {
  if (user.password) {
    user.password = crypt.md5(user.password);
  }
  return User
    .findByIdAndUpdate(user._id, user, { new: true })
    .exec();
};

// 获取多个用户
exports.getUsers = (pageNum, pageSize) => {
  return User.findUsers(pageNum, pageSize, { 
    role: {
      $lt: ROLE_ENUM.SUPER_ADMIN
    } 
  }, '');
};

// 根据角色获取多个用户
exports.getUsersByRole = (pageNum, pageSize, role) => {
  return User.findUsers(pageNum, pageSize, { role }, '');
};

// 根据名字获取多个用户
exports.getUsersByName = (pageNum, pageSize, name) => {
  return User.findUsers(pageNum, pageSize, { 
    role: {
      $lt: ROLE_ENUM.SUPER_ADMIN
    } 
  }, name);
};

// 根据部门全称获取多个用户
exports.getUsersByFullDeptName = (pageName, pageSize, fullDeptName) => {
  return User.findUsers(pageName, pageSize, { fullDeptName }, '');
};

// 根据部门全称递归获取其下级多个用户
exports.getUsersRecursivelyByFullDeptName = (pageName, pageSize, fullDeptName) => {
  return User.findUsers(pageName, pageSize, { 
    fullDeptName: {
      $regex: new RegExp(`^${fullDeptName}(?:|(\-[^\-]+)+)$`, 'gi')
    }
  }, '');
};

// 根据id获取单个用户
exports.getUserById = (_id) => {
  return User.findUser({ _id });
};