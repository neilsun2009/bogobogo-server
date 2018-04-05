const bonusController = require('../db/controllers/bonus'),
  projectController = require('../db/controllers/project'),
  dataHandler = require('../utils/dataHandler');
let controller = {};

function checkAuth(session, adminId) {
  return session._id === adminId.toString();
}

function checkUser(users, userId) {
  for (let user of users) {
    if (user._id.toString() === userId) {
      return true;
    } 
  }
  return false;
}

function checkProject(projectId, userId, session) {
  return new Promise((resolve, reject) => {
    projectController.getProjectById(projectId)
      .then((project) => {
        if (!project) {
          reject({
            code: 400,
            message: '该id项目不存在',
            data: null
          });
        } else if (!checkAuth(session, project.admin._id)) {
          reject({
            code: 403,
            message: '权限不足',
            data: null
          });
        } else if (!checkUser(project.users, userId)) {
          reject({
            code: 400,
            message: '用户不在该项目中',
            data: null
          });
        } else if (Date.now() > new Date(project.deadline)) {
          reject({
            code: 400,
            message: '超过评分时限',
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

function checkBonus(bonusId, session) {
  return new Promise((resolve, reject) => {
    bonusController.getBonusById(bonusId)
      .then((bonus) => {
        if (!bonus) {
          reject({
            code: 400,
            message: '该id加分不存在',
            data: null
          });
        } else if (!checkAuth(session, bonus.project.admin)) {
          reject({
            code: 403,
            message: '权限不足',
            data: null
          });
        } else if (Date.now() > new Date(bonus.project.deadline)) {
          reject({
            code: 400,
            message: '超过评分时限',
            data: null
          });
        } else {
          resolve(bonus);
        }
      }, (err) => {
        if (err.name === 'CastError') {
          reject({
            code: 400,
            message: '该id加分不存在',
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

controller.addBonus = (req, res, params) => {
  let { projectId, userId, name, score } = params;
  name = name && name.toString();
  score = parseFloat(score);
  if (!name || score !== score) {
    res.json({
      code: 400,
      message: '传入数据有误',
      data: null
    });
    return;
  }
  checkProject(projectId, userId, req.session.user)
    .then(() => {
      return bonusController.addBonus(projectId, userId, name, score);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then((bonus) => {
      res.json({
        code: 200,
        message: '添加加分成功',
        data: bonus
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
};

controller.updateBonus = (req, res, params) => {
  let { bonusId, name, score } = params,
    _bonus = {_id: bonusId};
  name = name && name.toString();
  score = parseFloat(score);
  if (name === name) {
    _bonus.name = name;
  }
  if (score || score === 0) {
    _bonus.score = score;
  }
  checkBonus(bonusId, req.session.user)
    .then(() => {
      return bonusController.updateBonus(_bonus);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then((bonus) => {
      res.json({
        code: 200,
        message: '更新加分成功',
        data: bonus
      });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err, 
        err.name === 'CastError' ? {
          code: 400,
          message: '传入数据有误',
          data: null,
          handled: true
        } : {
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
  
};

controller.deleteBonus = (req, res, params) => {
  const { bonusId } = params;
  checkBonus(bonusId, req.session.user)
    .then(() => {
      return bonusController.deleteBonus(bonusId);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then(() => {
      res.json({
        code: 200,
        message: '删除加分成功',
        data: null
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
};

module.exports = controller;