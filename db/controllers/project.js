const Project = require('../models/project'),
  Score = require('../models/score'),
  Bonus = require('../models/bonus'),
  ROLE_ENUM = require('../../config').ROLE_ENUM;

function setCondition(session, adminOnly) {
  const { role, _id: userId } = session;
  let condition = {};
  if (role === ROLE_ENUM.USER) {
    condition = { 
      users: { $elemMatch: { $eq: userId } }
    };
  } else if (role === ROLE_ENUM.ADMIN) {
    condition = adminOnly ? {
      admin: userId
    } : {
      $or: [{
        users: { $elemMatch: { $eq: userId} }
      }, {
        admin: userId
      }]
    };
  }
  return condition;
}

// 根据id获取单个项目
exports.getProjectById = (_id) => {
  return Project.findProject({ _id });
};

// 根据id和session获取单个项目
exports.getProjectByIdAndSession = (_id, session) => {
  return Project.findProject(
    Object.assign({}, { _id }, setCondition(session, false)));
};

// 获取多个项目
exports.getProjects = (pageNum, pageSize, sortBy, sortOrder, adminOnly, session) => {
  return Project.findProjects(pageNum, pageSize, sortBy, sortOrder, 
    setCondition(session, adminOnly), '');
};

// 根据项目名获取多个项目
exports.getProjectsByName = (pageNum, pageSize, sortBy, sortOrder, name, adminOnly, session) => {
  return Project.findProjects(pageNum, pageSize, sortBy, sortOrder, 
    setCondition(session, adminOnly), name);
};

// 删除项目
exports.deleteProject = (_id) => {
  return new Promise((resolve, reject) => {
    let projectPromise = Project
        .findByIdAndUpdate(_id, {isDeleted: true}, { new: true })
        .exec(),
      scorePromise = Score.update({project: _id}, {
        isDeleted: true
      }, {
        multi: true
      }).exec(),
      bonusPromise = Bonus.update({project: _id}, {
        isDeleted: true
      }, {
        multi: true
      }).exec();
    Promise.all([projectPromise, scorePromise, bonusPromise])
      .then(() => {
        resolve();
      }, (err) => {
        reject(err);
      });
  });
};

// 添加项目
// 根据逻辑，传入数据的users数组已包含项目管理员
// weights也已计算好
exports.addProject = (project) => {
  return new Promise((resolve, reject) => {
    let _project = new Project(project);
    _project.save()
      .then((project) => {
        let scores = [];
        const users = project.users,
          inSumUsers = project.inSumUsers,
          projectId = project._id;
        for (let i = 0, len = users.length; i < len; ++i) {
          let isInSum = inSumUsers.indexOf(users[i]) !== -1;
          for (let j = 0; j < len; ++j) {
            scores.push({
              rater: users[i],
              user: users[j],
              project: projectId,
              isInSum
            });
          }
        }
        _project = project;
        return Score.create(scores);
      }, (err) => {
        reject(err);
      })
      .then((scores) => {
        _project.scores = scores;
        resolve(_project);
      }, (err) => {
        reject(err);
      });
  });
};

// 更新项目
// 根据逻辑，addUsers数组应该仅有非users中的用户id
// deleteUsers应该仅有users中的用户id，且没有admin
// project中weight与users已计算好
// midUsers为原始users数据去掉deleteUsers的结果
exports.updateProject = (_project, midUsers, addUsers, deleteUsers) => {
  return new Promise((resolve, reject) => {
    let project = null;
    Project.findByIdAndUpdate(_project._id, _project, { new: true })
      .exec()
      .then((_project) => {
        project = _project;
        if (!project) {
          resolve(project);
        }
        let deletePromise = Score.update({ 
            $or: [
              {user: {$in: deleteUsers}},
              {rater: {$in: deleteUsers}}
            ],
            project: project._id
          }, {
            isDeleted: true
          }, {
            multi: true
          }).exec(), // 删除评分
          deleteBonusPromise = Bonus.update({
            project: project._id,
            user: {$in: deleteUsers}
          }, {
            isDeleted: true
          }, {
            multi: true
          }),
          addPromise = null,// 增加评分
          scores = [],
          projectId = project._id;
        // 设置新scores
        for (let i = 0, len = addUsers.length; i < len; ++i) {
          for (let j = 0; j < len; ++j) {
            scores.push({
              user: addUsers[i],
              rater: addUsers[j],
              project: projectId
            });
          }
          for (let j = 0, len2 = midUsers.length; j < len2; ++j) {
            scores = scores.concat([{
              user: addUsers[i],
              rater: midUsers[j],
              project: projectId
            }, {
              user: midUsers[j],
              rater: addUsers[i],
              project: projectId
            }]);
          }
        }
        addPromise = Score.create(scores);
        return Promise.all([deletePromise, deleteBonusPromise, addPromise]);
      }, (err) => {
        reject(err);
      })
      .then(() => {
        const inSumUsers = project.inSumUsers;
        return Promise.all([
          Score.update({
            project: project._id,
            rater: {$in: inSumUsers},
            isDeleted: false
          }, {
            isInSum: true
          }, {
            multi: true
          }).exec(),
          Score.update({
            project: project._id,
            rater: {$nin: inSumUsers},
            isDeleted: false
          }, {
            isInSum: false
          }, {
            multi: true
          }).exec()
        ]);
      }, (err) => {
        reject(err);
      })
      .then(() => {
        resolve(project);
      }, (err) => {
        reject(err);
      });
  }); 
};