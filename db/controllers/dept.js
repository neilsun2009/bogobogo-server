const Dept = require('../models/dept');

// 分割部门信息
function splitDept(fullDeptName) {
  const depts = fullDeptName.split('-');
  let arr = [];
  depts.forEach((elem, index) => {
    arr.push({
      deptName: elem,
      fullDeptName: index ? `${arr[index-1].fullDeptName}-${elem}` : elem
    });
  });
  return arr;
}

// 加入新部门
function addDept(_dept) {
  const { fullDeptName } = _dept;
  return new Promise((resolve, reject) => {
    exports.getDeptByName(fullDeptName)
      .then((dept) => {
        if (dept) {
          resolve(dept);
        } else {
          console.log(`Save new department: ${fullDeptName}`);
          dept = new Dept(_dept);
          return dept.save();
        }
      }, (err) => {
        reject(err);
      });
  });
}

// 根据部门全称获取单个部门
exports.getDeptByName = (fullDeptName) => {
  return Dept.findDept({ fullDeptName });
};

// 根据部门全称获取子部门
exports.getSubDeptsByName = (pageName, pageSize, name) => {
  let reg = '';
  if (name) {
    reg = `^${name}\-[^\-]+$`;
  } else {
    reg = '^[^\-]+$';
  }
  return Dept.findDepts(pageName, pageSize, {
    fullDeptName: {
      $regex: new RegExp(reg, 'gi')
    }
  });
};

// 检查部门信息，并确定加入或更新
exports.checkDept = (fullDeptName) => {
  let arr = splitDept(fullDeptName),
    promises = arr.map((elem) => {
      return addDept(elem);
    });
  return Promise.all(promises); 
};
