const userController = require('../db/controllers/user'),
  deptController = require('../db/controllers/dept');
let controller = {};

controller.getSubDeptsAndUsersByFullDeptName = (req, res, params) => {
  let { fullDeptName } = params;
  fullDeptName = fullDeptName === 'root' ? '' : fullDeptName.toString();
  let promiseUser = userController.getUsersByFullDeptName(0, 0, fullDeptName),
    promiseDept = deptController.getSubDeptsByName(0, 0, fullDeptName);
  return Promise.all([promiseUser, promiseDept])
    .then((values) => {
      res.json({
        code: 200,
        message: '获取子部门与用户成功',
        data: {
          users: values[0],
          subDepts: values[1]
        }
      });
    }, (err) => {
      res.json({
        code: 500,
        message: '服务器错误',
        data: err
      });
    });
};

module.exports = controller;