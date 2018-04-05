const userController = require('../db/controllers/user'),
  SUPER_ADMIN_CONFIG = require('../config').SUPER_ADMIN;

function init() {
  // const username = SUPER_ADMIN_CONFIG.username,
  //   password = SUPER_ADMIN_CONFIG.initPwd;
  // // 检查是否存在超级管理员
  // userController.checkUsername(username)
  //   .then((user) => {
  //     if (!user) {
  //       userController.addSuperAdmin(username, password)
  //         .then(() => {
  //           console.log('Set up new super admin: ', username);
  //         }, (err) => {
  //           console.log(err);
  //         });
  //     }
  //   }, (err) => {
  //     console.log(err);
  //   });
}

module.exports = init;