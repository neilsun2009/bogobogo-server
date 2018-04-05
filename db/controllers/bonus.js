const Bonus = require('../models/bonus');

// 根据id获取单个项目
exports.getBonusById = (_id) => {
  return Bonus.findBonus({ _id });
};

// 根据项目与用户id获取多个加分
exports.getBonuses = (pageNum, pageSize, projectId, userId) => {
  return Bonus.findBonuses(pageNum, pageSize, {
    project: projectId,
    user: userId
  });
};

// 删除加分
exports.deleteBonus = (_id) => {
  return Bonus
    .findByIdAndUpdate(_id, {isDeleted: true}, {new: true})
    .exec();
};

// 增加加分
exports.addBonus = (projectId, userId, name, score) => {
  let _bonus = new Bonus({
    project: projectId,
    user: userId,
    name,
    score
  });
  return _bonus.save();
};

// 修改加分
exports.updateBonus = (_bonus) => {
  return Bonus
    .findByIdAndUpdate(_bonus._id, _bonus, {new: true})
    .exec();
};