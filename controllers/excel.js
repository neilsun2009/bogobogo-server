const xlsx = require('node-xlsx'),
  scoreController = require('../db/controllers/score'),
  projectController = require('../db/controllers/project'),
  dataHandler = require('../utils/dataHandler'),
  config = require('../config'),
  ROLE_ENUM = config.ROLE_ENUM;
let controller = {};

function checkAuth(session, admin) {
  return session.role > ROLE_ENUM.ADMIN || 
    session._id === admin._id.toString();
}

function checkProject(projectId, session) {
  return new Promise((resolve, reject) => {
    projectController.getProjectById(projectId)
      .then((project) => {
        if (!project) {
          reject({
            code: 400,
            message: '该id项目不存在',
            data: null
          });
        } else if (!checkAuth(session, project.admin)) {
          reject({
            code: 403,
            message: '权限不足',
            data: null
          });
        } else {
          resolve(project);
        }
      }, (err) => {
        if (err.name === 'CastError') {
          reject({
            code: 400,
            message: '该id项目不存在',
            data: null
          });
        } else {
          reject({
            code: 500,
            message: '服务器错误',
            data: err      
          });
        }
      });
  });
}

controller.exportExcelSumByProject = (req, res, params) => {
  const projectId = params.projectId;
  let project = null;
  checkProject(projectId, req.session.user, null)
    .then((_project) => {
      project = _project;
      return scoreController.getSumsByProject(0, 0, projectId);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then((data) => {
      let xlsxData = [
        [`评分汇总 - ${project.name}`], 
        [`截至${new Date().toLocaleString()}`], 
        ['姓名', '互评', '加分', '负责人评分', '总分']
      ];
      for (let i = 0, len = data.count; i < len; i++) {
        let item = data.sums[i];
        // bonus = '';
        // for (let j = 0, bonusLen = item.bonus.count; j < bonusLen; ++j) {
        //   let bonusItem = item.bonus.bonuses[j];
        //   bonus += `${bonusItem.name}：${bonusItem.score}；`;
        // }
        // bonus += `总加分：${item.bonus.sum}`;
        xlsxData.push([
          item.user.chName, item.average === null ? 0 : item.average, 
          item.bonus.sum,
          null,
          {t: 'n', v: item.sum, f: `0.6*B${i+4}+C${i+4}+0.4*D${i+4}`}
        ]);
      }
      let buffer = xlsx.build([
        {name: `评分汇总 - ${project.name}`, data: xlsxData}
      ], {
        '!merges': [{s: {c: 0, r:0 }, e: {c:4, r:0}}, {s: {c: 0, r:1 }, e: {c:4, r:1}}]
      });
      
      res.set('Content-Type', 'application/vnd.openxmlformats');
      res.set('Content-Disposition', `attachment; filename=${encodeURI('评分汇总 - ' + project.name + ' - ' + new Date().toLocaleString())}.xlsx`);
      res.end(buffer, 'binary');
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err,{
        code: 500,
        message: '服务器错误',
        data: err
      }));
    })
    .catch((e) => {
      delete e.handled;
      res.send(e);
    });
};

module.exports = controller;