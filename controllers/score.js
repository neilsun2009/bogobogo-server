const scoreController = require('../db/controllers/score'),
  projectController = require('../db/controllers/project'),
  dataHandler = require('../utils/dataHandler'),
  config = require('../config'),
  ROLE_ENUM = config.ROLE_ENUM;
let controller = {};

function checkAuth(session, admin, raterId) {
  return session.role > ROLE_ENUM.ADMIN || 
    session._id === admin._id.toString() ||
    raterId === session._id;
}

function checkProject(projectId, session, raterId) {
  return new Promise((resolve, reject) => {
    projectController.getProjectById(projectId)
      .then((project) => {
        if (!project) {
          reject({
            code: 400,
            message: '该id项目不存在',
            data: null
          });
        } else if (!checkAuth(session, project.admin, raterId)) {
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

function checkScore(scoreId, session) {
  return new Promise((resolve, reject) => {
    scoreController.getScoreById(scoreId)
      .then((score) => {
        if (!score) {
          reject({
            code: 400,
            message: '该id评分不存在',
            data: null
          });
        } else if (score.rater._id.toString() !== session._id) {
          reject({
            code: 403,
            message: '权限不足',
            data: null
          });
        } else if (Date.now() > new Date(score.project.deadline)) {
          reject({
            code: 400,
            message: '超过评分时限',
            data: null
          });
        }  else {
          resolve(score);
        }
      }, (err) => {
        if (err.name === 'CastError') {
          reject({
            code: 400,
            message: '该id评分不存在',
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

function updateScore(scoreId, scores, comment, session) {
  let adminId = null;
  return new Promise((resolve, reject) => {
    checkScore(scoreId, session)
      .then((_score) => {
        const weights = _score.project.weights;
        adminId = _score.project.admin._id.toString();
        let score = { _id: _score._id };
        if (scores) {
          score.scores = {
            workload: scores.workload,
            difficulty: scores.difficulty,
            quality: scores.quality
          };
          score.average = score.scores.workload * weights.workload 
            + score.scores.difficulty * weights.difficulty
            + score.scores.quality * weights.quality;
          score.hasRated = true;
        }
        if (comment) {
          score.comment = comment;
        }
        return scoreController.updateScore(score);
      }, (err) => {
        reject(err);
      })
      .then((score) => {
        resolve(dataHandler.handleScoreData(score, session, adminId));
      }, (err) => {
        reject(err.name === 'CastError' ? {
          code: 400,
          message: '传入数据有误',
          data: null
        } : {
          code: 500,
          message: '服务器错误',
          data: err 
        });
      });
  });
}

controller.getSumsByProject = (req, res, params) => {
  const pageParams = dataHandler.parsePageParams(params),
    projectId = params.projectId;
  checkProject(projectId, req.session.user, null)
    .then(() => {
      return scoreController.getSumsByProject(pageParams.pageNum, pageParams.pageSize, projectId);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then((data) => {
      res.json({
        code: 200,
        message: '获取评分成功',
        data: data
      });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err,{
        code: 500,
        message: '服务器错误',
        data: err
      }));
    })
    .catch((e) => {
      delete e.handled;
      res.json(e);
    });
};

controller.getSumsByUser = (req, res, params) => {
  const pageParams = dataHandler.parsePageParams(params),
    userId = params.userId;
  scoreController.getSumsByUser(pageParams.pageNum, pageParams.pageSize, userId, req.session.user._id)
    .then((data) => {
      res.json({
        code: 200,
        message: '获取评分成功',
        data: data
      });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err,{
        code: 500,
        message: '服务器错误',
        data: err
      }));
    })
    .catch((e) => {
      delete e.handled;
      res.json(e);
    });
};

controller.getScoresByProjectAndUser = (req, res, params) => {
  const pageParams = dataHandler.parsePageParams(params),
    { projectId, userId } = params;
  checkProject(projectId, req.session.user, null)
    .then(() => {
      return scoreController.getScoresByProjectAndUser(pageParams.pageNum, pageParams.pageSize, projectId, userId);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then((data) => {
      res.json({
        code: 200,
        message: '获取评分成功',
        data: data
      });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err,
        err.name === 'CastError' ? {
          code: 400,
          message: '改id用户不存在',
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

controller.getScoresByProjectAndRater = (req, res, params) => {
  const pageParams = dataHandler.parsePageParams(params),
    { projectId, raterId } = params;
  let adminId = null;
  checkProject(projectId, req.session.user, raterId)
    .then((project) => {
      adminId = project.admin._id.toString();
      return scoreController.getScoresByProjectAndRater(pageParams.pageNum, pageParams.pageSize, projectId, raterId);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then((data) => {
      data.score = dataHandler.handleScoresData(data.score, req.session.user, adminId);
      res.json({
        code: 200,
        message: '获取评分成功',
        data: data
      });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err,
        err.name === 'CastError' ? {
          code: 400,
          message: '改id用户不存在',
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

controller.updateScore = (req, res, params) => {
  const { scoreId, scores, comment } = params;
  updateScore(scoreId, scores, comment, req.session.user)
    .then((score) => {
      res.json({
        code: 200,
        message: '更新评分成功',
        data: score
      });
    }, (err) => {
      res.json(err);
    });
};

controller.updateScores = (req, res, params) => {
  let { scores } = params;
  scores = Array.isArray(scores) ? scores : [];
  let promises = scores.map((score) => {
    return updateScore(score._id, score.scores, score.comment, req.session.user);
  });
  Promise.all(promises)
    .then((scores) => {
      res.json({
        code: 200,
        message: '更新评分成功',
        data: scores
      });
    }, (err) => {
      res.json(err);
    });
};

module.exports = controller;