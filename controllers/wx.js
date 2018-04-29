const request = require('request');
const sha1 = require('sha1');
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 3600, checkperiod: 3600});
const GRANT_TYPE = 'client_credential';
const APP_ID = 'wx16f369b57c3105ec';
const APP_SECRET = '3f4957cc76021b4a6995f34f2335dcea';
const NONCE_STR = 'bogodeakshdfky13asfa1fhigo3';
let controller = {};

controller.getWXToken = (req, res, params) => {
  let accessToken = '',
    jsAPITicket = '',
    tokenPromise = (resolve, reject) => {
      cache.get('access_token', (err, data) => {
        if (!err && data) {
          // console.log(data);
          accessToken = data;
          resolve();
        } else {
          request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=${GRANT_TYPE}&appid=${APP_ID}&secret=${APP_SECRET}`,
            (err, request, body) => {
              if (err) {
                reject();
              } else {
                accessToken = JSON.parse(body).access_token;
                // console.log(body);
                cache.set('access_token', accessToken);
                resolve();
              }
            });
        }
      });
    },
    ticketPromise = (resolve, reject) => {
      // console.log(accessToken);      
      cache.get('api_ticket', (err, data) => {
        if (!err && data) {
          // console.log(data);
          jsAPITicket = data;
          resolve();
        } else {
          request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`,
            (err, request, body) => {
              if (err) {
                reject();
              } else {
                jsAPITicket = JSON.parse(body).ticket;
                // console.log(body);
                // console.log(jsAPITicket, body.ticket);   
                cache.set('api_ticket', jsAPITicket);
                resolve();
              }
            });
        }
      });
    };
  // get access token
  new Promise(tokenPromise).then(() => {
    return new Promise(ticketPromise);
  }, () => {
    res.json({
      result: false
    });
  }).then(() => {
    let time = Date.now(),
      str = `jsapi_ticket=${jsAPITicket}&noncestr=${NONCE_STR}&timestamp=${time}&url=${params.url}`,
      signature = sha1(str);
    console.log(str, jsAPITicket, accessToken);
    res.json({
      result: true,
      data: {
        appId: APP_ID,
        timestamp: time,
        nonceStr: NONCE_STR,
        signature: signature,
      }
    });
  }, () => {
    res.json({
      result: false
    });
  });
  
  // request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=${GRANT_TYPE}&appid=${APP_ID}&secret=${APP_SECRET}`,
  //   (err, request, body) => {
  //     accessToken = JSON.parse(body).access_token;
  //     // get api ticket
  //     request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`,
  //     (err, request, body) => {
  //       jsAPITicket = body.ticket;        
  //       let time = Date.now(),
  //         str = `jsapi_ticket=${jsAPITicket}&noncestr=${NONCE_STR}&timestamp=${time}&url=${params.url}`,
  //         signature = sha1(str);
  //       res.json({
  //         appId: APP_ID,
  //         timestamp: time,
  //         nonceStr: NONCE_STR,
  //         signature: signature,
  //       });
  //     });
  //   });
}

module.exports = controller;
  