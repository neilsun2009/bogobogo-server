const User = require('../models/user'),
  crypt = require('../../utils/crypt'),
  ROLE_ENUM = require('../../config').ROLE_ENUM;

// 检查用户名与密码
exports.checkUsernameAndPassword = (username, password) => {
  return User.findUser({username, password: crypt.md5(password)});
};

// 加入新用户
exports.addUser = (user) => {
  user.password = crypt.md5(user.password);  
  let _user = new User(user);
  return _user.save();
};

// 更新用户信息
exports.updateUser = (user) => {
  user.password = crypt.md5(user.password);
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

// 根据id获取单个用户
exports.getUserById = (_id) => {
  return User.findUser({ _id });
};

// 根据用户名获取用户
exports.getUserByUsername = (username) => {
  return User.findUser({ username });
};