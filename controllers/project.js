const projectController = require('../db/controllers/project'),
  scoreController = require('../db/controllers/score'),
  config = require('../config'),
  dataHandler = require('../utils/dataHandler'),
  ROLE_ENUM = config.ROLE_ENUM;
let controller = {};

function uniquefyArray(arr) {
  return arr.filter((elem, index, _arr) => {
    return _arr.indexOf(elem) === index;
  });
}

function checkAuth(session, admin) {
  return session.role > ROLE_ENUM.ADMIN || session._id === admin._id.toString();
}

function checkProject(projectId, session) {
  return new Promise((resolve, reject) => {
    projectController.getProjectById(projectId)
      .then((project) => {
        if (!project) {
          reject({
            code: 400, message: '该id项目不存在', data: null
          });
        } else if (!checkAuth(session, project.admin)) {
          reject({
            code: 403, message: '权限不足', data: null
          });
        } else {
          resolve(project);
        }
      }, (err) => {
        if (err.name === 'CastError') {
          reject({
            code: 400, message: '该id项目不存在', data: null
          });
        } else {
          reject({
            code: 500, message: '服务器错误', data: err      
          });
        }
      });
  });
}

function calWeights(workload, difficulty) {
  let quality = 1 - workload - difficulty;
  if (workload !== workload && difficulty !== difficulty) { // 全为NaN
    workload = 0.33; difficulty = 0.33; quality = 0.34;
  } else if (workload !== workload || difficulty !== difficulty) { // 有一个为NaN
    workload = NaN; difficulty = NaN; quality = NaN;
  }
  return {
    workload, difficulty, quality
  };
}

controller.getProjectById = (req, res, params) => {
  const session = req.session.user;
  projectController.getProjectByIdAndSession(params.projectId, session)
    .then((project) => {
      if (project) {
        res.json({ code: 200, message: '获取项目成功',  data: dataHandler.handleProjectData(project, session) });
      } else {
        res.json({ code: 400,  message: '该id项目不存在或权限不足', data: null });
      }
    }, (err) => {
      if (err.name === 'CastError') {
        res.json({ code: 400, message: '该id项目不存在', data: null });
      } else {
        res.json({ code: 500, message: '服务器错误', data: err });
      }
    });
};

controller.getProjects = (req, res, params) => {
  const session = req.session.user;
  let pageParams = dataHandler.parsePageParams(params),
    adminOnly = params.adminOnly === 'true';
  projectController.getProjects(pageParams.pageNum, pageParams.pageSize, 
    pageParams.sortBy, pageParams.sortOrder, adminOnly, session)
    .then((data) => {
      res.json({ code: 200, message: '获取项目成功', data: dataHandler.handleProjectsData(data, session) });
    }, (err) => {
      res.json({ code: 500, message: '服务器错误', data: err });
    });
};

controller.getProjectsByName = (req, res, params) => {
  const session = req.session.user;
  let pageParams = dataHandler.parsePageParams(params),
    adminOnly = params.adminOnly === 'true',
    projectName = params.projectName && params.projectName.toString();
  projectController.getProjectsByName(pageParams.pageNum, pageParams.pageSize, 
    pageParams.sortBy, pageParams.sortOrder, projectName, adminOnly, req.session.user)
    .then((data) => {
      res.json({ code: 200, message: '获取项目成功', data: dataHandler.handleProjectsData(data, session) });
    }, (err) => {
      res.json({ code: 500, message: '服务器错误', data: err });
    });
};

controller.deleteProject = (req, res, params) => {
  const projectId = params.projectId;
  checkProject(projectId, req.session.user)
    .then(() => {
      return projectController.deleteProject(projectId);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then(() => {
      res.json({ code: 200, message: '删除项目成功', data: null });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err, {
        code: 500, message: '服务器错误', data: err, handled: true
      }));
    })
    .catch((e) => {
      delete e.handled;
      res.json(e);
    });
};

controller.addProject = (req, res, params) => {
  const _weights = params.weights,
    weights = calWeights(parseFloat(_weights.workload), parseFloat(_weights.difficulty)),
    deadline = params.deadline || Date.now() + 1000 * 60 * 60 * 24,
    adminId = req.session.user._id;
  let users = Array.isArray(params.users) ? uniquefyArray(params.users) : [],
    inSumUsers = Array.isArray(params.inSumUsers) ? uniquefyArray(params.inSumUsers) : [];
  // weights格式错误
  if (weights.workload !== weights.workload) { // NaN
    res.json({ code: 400, message: '传入数据有误', data: null });
  }
  // 检查admin是否在users数组
  if (users.indexOf(adminId) === -1) {
    users.push(adminId);
    inSumUsers.push(adminId);
  }
  projectController.addProject({
    name: params.name.toString(),
    admin: adminId,
    users, 
    inSumUsers,
    deadline,
    weights
  }).then((data) => {
    res.json({ code: 200, message: '添加项目成功', data });
  }, (err) => {
    if (err.name === 'CastError') {
      res.json({ code: 400, message: '传入数据有误', data: err });
    } else {
      res.json({ code: 500, message: '服务器错误', data: err });
    }
  });
};

controller.updateProject = (req, res, params) => {
  const { name, addUsers: _addUsers, deleteUsers: _deleteUsers, 
      deadline, weights: _weights, projectId, inSumUsers } = params,
    weights = calWeights(parseFloat(_weights.workload), parseFloat(_weights.difficulty));
  let _project = { _id: projectId}, 
    addUsers = null, deleteUsers = null, promiseScore = null;
  if (name) {
    _project.name = name;
  }
  if (deadline) {
    _project.deadline = deadline;
  }
  if (weights.workload === weights.workload) { // !NaN
    _project.weights = weights;
    promiseScore = scoreController.updateAverages(weights, projectId);
  }
  if (Array.isArray(inSumUsers)) {
    _project.inSumUsers = uniquefyArray(inSumUsers);
  }
  addUsers = Array.isArray(_addUsers) ? uniquefyArray(_addUsers) : [];
  deleteUsers = Array.isArray(_deleteUsers) ? uniquefyArray(_deleteUsers) : [];
  // 查询项目，以确定更新后users
  checkProject(projectId, req.session.user)
    .then((project) => {
      let users = project.users.map((elem) => {
          return elem._id.toString();
        }),
        midUsers = null;
      deleteUsers = deleteUsers.filter((id) => {
        let index = users.indexOf(id);
        if (index !== -1 && id !== project.admin._id.toString()) {
          users.splice(index, 1);
          return true;
        } else {
          return false;
        }
      });
      midUsers = users.concat();
      addUsers = addUsers.filter((id) => {
        if (users.indexOf(id) === -1) {
          users.push(id);
          return true;
        } else {
          return false;
        }
      });
      _project.users = users;
      return Promise.all([
        projectController.updateProject( _project, midUsers, addUsers, deleteUsers),
        promiseScore
      ]);
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then((values) => {
      res.json({
        code: 200, message: '修改项目成功', data: values[0]
      });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err, 
        err.name === 'CastError' ? 
          { code: 400, message: '传入数据有误', data: null, handled: true} 
          : { code: 500, message: '服务器错误', data: err, handled: true }
      ));
    })
    .catch((e) => {
      delete e.handled;
      res.json(e);
    });
};

module.exports = controller;