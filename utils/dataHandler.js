const ROLE = require('../config').ROLE;

exports.parsePageParams = (params) => {
  let { pageNum, pageSize, sortBy, sortOrder } = params;
  pageNum = parseInt(pageNum),
  pageSize = parseInt(pageSize);
  pageNum = pageNum > 0 ? pageNum : 0;
  pageSize = pageSize > 0 ? pageSize : 0;
  switch (sortBy) {
  case 'createdTime':
    sortBy = 'meta.createdTime';
    break;
  case 'deadline':
    sortBy = 'deadline';
    break;
  case 'name':
    sortBy = 'name';
    break;
  default: 
    sortBy = 'deadline';
  }
  if (sortOrder !== 'asc') {
    sortOrder = 'desc';
  }
  return {
    pageNum, pageSize, sortBy, sortOrder
  };
};

// Promise中多层处理error
// 由于promise多层调用时，如果报错，将会执行所有reject
// 因此将reject中使用Promise.reject向下传递，直到catch
// 这样能够保持每一步错误处理的独立性
// 从第二层开始使用此方法，传入上一步带下来的err与新error
// 注意err要有handled参数作为判断
exports.errorHandler = (err, newErr) => {
  if (err.handled) { // 上一级已报错
    return err;
  } else {
    return newErr;
  }
};