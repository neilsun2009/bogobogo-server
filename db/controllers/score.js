const Score = require('../models/score'),
  Bonus = require('../models/bonus');

// 根据id获取单个评分
exports.getScoreById = (_id) => {
  return Score.findScore({ _id });
};

// 根据项目id获得各个用户总分
exports.getSumsByProject = (pageNum, pageSize, projectId) => {
  return Score.findSums(pageNum, pageSize, 'project', projectId);
};

// 根据用户id获得各个项目总分
exports.getSumsByUser = (pageNum, pageSize, userId, adminId) => {
  return Score.findSums(pageNum, pageSize, 'user', userId, adminId);
};

// 根据被评分用户id与项目id获取详细评分
exports.getScoresByProjectAndUser = (pageNum, pageSize, projectId, userId) => {
  return new Promise((resolve, reject) => {
    let promiseScores = Score.findScores(pageNum, pageSize, 
        {project: projectId, user: userId}, 
        ['rater']),
      promiseBonuses = Bonus.findBonuses(0, 0, {project: projectId, user: userId});
    Promise.all([promiseScores, promiseBonuses])
      .then((values) => {
        let data = Object.assign({}, values[0], {bonus: values[1]});
        data.sum = data.score.average + data.bonus.sum;
        resolve(data);
      }, (err) => {
        reject(err);
      });
  });
};

// 根据评分用户id与项目id获取详细评分
exports.getScoresByProjectAndRater = (pageNum, pageSize, projectId, raterId) => {
  return Score.findScores(pageNum, pageSize, 
    {project: projectId, rater: raterId}, 
    ['user']);
};

// 更新评分
exports.updateScore = (_score) => {
  return Score.findOneAndUpdate({
    _id: _score._id
  }, _score, { new: true } )
    .exec();
};

// 更新平均分
exports.updateAverages = (weights, projectId) => {
  return new Promise((resolve, reject) => {
    Score.find({project: projectId, isDeleted: false})
      .exec()
      .then((scores) => {
        let count = scores.length,
          finished = 0,
          lock = false;
        scores.forEach((score) => {
          let _scores = score.scores;
          if (score.hasRated) {
            score.update({
              average: _scores.workload * weights.workload + 
                _scores.difficulty * weights.difficulty +
                _scores.quality * weights.quality
            }).exec()
              .then(() => {
                while (lock) {
                  lock = true;
                }
                lock = true;
                if (++finished === count) {
                  resolve();
                }
                lock = false;
              }, (err) => {
                reject(err);
              });
          } else {
            if (++finished === count) {
              resolve();
            }
          }
        });
      }, (err) => {
        reject(err);
      });
  });
};