const projectController = require('../db/controllers/project'),
  config = require('../config'),
  ROLE_ENUM = config.ROLE_ENUM,
  dataHandler = require('../utils/dataHandler'),
  nodemailer = require('nodemailer');
let controller = {};

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

function sendMail(userIds, project, password) {
  const transporter = nodemailer.createTransport({
    service: config.MAIL.service,
    auth: {
      user: project.admin.email,
      pass: password
    }
  });
  let mailOption = {
      from: project.admin.email,
      subject: `请完成“${project.name}”评分`
    },
    link = `${config.MAIL.domain}#/home?id=${project._id}`,
    receivers = [];
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return;
  }
  mailOption.html = `<p>请完成“${project.name}”评分</p>
    <p>评分地址：<a href=${link}>${link}</a></p>
    <p>截止日期：${new Date(project.deadline).toLocaleDateString()}</p>
    <p>请在截止日期前完成评分，谢谢合作！</p><br>
    <p>评分狗系统</p>
    <p>${new Date().toLocaleDateString()}</p>`;
  project.users.forEach((elem) => {
    if (userIds.indexOf(elem._id.toString()) > -1) {
      receivers.push(elem.email);
    }
  });
  mailOption.to = receivers.join(', ');
  return transporter.sendMail(mailOption);
}

controller.sendMailByProject = (req, res, params) => {
  let { users, projectId, password } = params;
  password = password || '';
  users = Array.isArray(users) ? users : [];
  checkProject(projectId, req.session.user)
    .then((project) => {
      return sendMail(users, project, password.toString());
    }, (err) => {
      err.handled = true;
      return Promise.reject(err);
    })
    .then(() => {
      res.json({
        code: 200,
        message: '邮件发送成功',
        data: null
      });
    }, (err) => {
      return Promise.reject(dataHandler.errorHandler(err, 
        err.code === 'EAUTH' ?  {
          code: 400,
          message: '邮箱密码错误', 
          data: err, 
          handled: true
        }: {
          code: 500,
          message: '服务器错误', 
          data: err, 
          handled: true
        }
      ));
    })
    .catch((e) => {
      delete e.handled;
      res.json(e);
    });
};

module.exports = controller;