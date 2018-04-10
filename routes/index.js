const ACTIONS = require('../actions'),
  CONTROLLERS = require('../controllers'),
  ROLE = require('../config').ROLE;

function checkPermission(auth, session) {
  if (!auth) {
    return true;
  } else {
    if (!session || auth > ROLE[session.auth]) {
      return false;
    } else {
      return true;
    }
  }
}

function dispatch(action) {
  return (req, res) => {
    const { method, auth } = action,
      controller = CONTROLLERS[action.controller];
    let params = Object.assign({}, req.params, method === 'GET' ? req.query : req.body);
    if (!controller) {
      res.json({
        code: 500,
        message: 'Server error.',
        data: 'No route controller found.',
        result: false
      });
      return;
    }
    if (checkPermission(auth, req.session.user)) {
      controller(req, res, params);
    } else {
      res.json({
        code: 403,
        message: 'Access denied.',
        data: null,
        result: false
      });
    }
  };
}

module.exports = (app) => {
  for (let item in ACTIONS) {
    let action = ACTIONS[item];
    switch (action.method) {
    case 'GET': 
      app.get(action.url, dispatch(action));
      break;
    case 'POST': 
      app.post(action.url, dispatch(action));
      break;
    case 'PUT':
      app.put(action.url, dispatch(action));
      break;
    case 'DELETE':
      app.delete(action.url, dispatch(action));
      break;
    default:
      break;
    }
  }
};