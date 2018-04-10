const qiniu = require('qiniu');
let controller = {};

controller.getQiniuToken = (req, res) => {
  const accessKey = '9sq9OWStdFni0cLou2ChAboycAxvEiKHSc0nf4nZ';
  const secretKey = 'TmCbNS9Tw6YAnFVD8AGfiFGZuSYp3M9c6v8MdMBF';
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  let options = {
    scope: 'neilsun2009',
  },
  putPolicy = new qiniu.rs.PutPolicy(options),
  uploadToken = putPolicy.uploadToken(mac);
  res.json({
    uptoken: uploadToken
  });
}

module.exports = controller;
  